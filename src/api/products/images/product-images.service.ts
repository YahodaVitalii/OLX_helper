import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductImagesRepository } from './product-images.repository';
import { S3Service } from '../../../s3/s3.service';
import PRODUCT_IMAGES_PREFIX from '../../../constants/s3.const';
import { ProductImageDto } from './dto/product-image.dto';

@Injectable()
export class ProductImagesService {
  constructor(
    private readonly imagesRepository: ProductImagesRepository,
    private readonly s3Service: S3Service,
  ) {}

  async saveImages(productId: number, images: Express.Multer.File[]) {
    if (!images.length) {
      throw new BadRequestException('No files uploaded');
    }
    await this.ensureProductImageLimit(productId, images.length);
    const uploadedImages = await Promise.all(
      images.map(async (file, index) => {
        const key = `${PRODUCT_IMAGES_PREFIX}/${productId}/${Date.now()}-${index}-${file.originalname}`;
        const url = await this.s3Service.uploadFile(file, key);

        return {
          productId,
          url,
          order: index,
        };
      }),
    );

    await this.imagesRepository.createMany(uploadedImages);
    return uploadedImages;
  }
  private async ensureProductImageLimit(
    productId: number,
    newFilesCount: number,
  ): Promise<number> {
    const existingCount =
      await this.imagesRepository.countByProductId(productId);

    if (existingCount + newFilesCount > 8) {
      throw new BadRequestException(
        `Product ${productId} already has ${existingCount} images. Maximum allowed is 8. Reduce the number of images.`,
      );
    }

    return existingCount;
  }
  async replaceImages(
    targetImageIds: number[],
    files: Express.Multer.File[],
  ): Promise<ProductImageDto[]> {
    if (targetImageIds.length !== files.length) {
      throw new BadRequestException(
        'Number of files must match number of target image IDs',
      );
    }

    const results: ProductImageDto[] = [];

    for (let i = 0; i < targetImageIds.length; i++) {
      const imageId = targetImageIds[i];
      const file = files[i];

      const image = await this.imagesRepository.findById(imageId);
      if (!image) {
        throw new BadRequestException(`Image with ID ${imageId} not found`);
      }

      const key = `${PRODUCT_IMAGES_PREFIX}/${image.productId}/${Date.now()}-${file.originalname}`;
      const newUrl = await this.s3Service.uploadFile(file, key);

      await this.s3Service.deleteFile(image.url);

      const updated = await this.imagesRepository.updateUrlAndOrder(
        imageId,
        newUrl,
        image.order,
      );
      results.push(updated);
    }

    return results;
  }
  async changeOrder(productId: number, orderMap: Record<number, number>) {
    const entries = this.buildEntries(orderMap);
    const ids = entries.map(([id]) => id);

    const allImages = await this.imagesRepository.findByProduct(productId);

    this.validateNoConflicts(entries, ids, allImages);

    await this.imagesRepository.updateOrdersTwoPhase(entries, allImages);

    return this.imagesRepository.findByIdsOrdered(ids);
  }

  private buildEntries(orderMap: Record<number, number>): [number, number][] {
    return Object.entries(orderMap).map(
      ([id, o]) => [Number(id), Number(o)] as const,
    );
  }

  private validateNoConflicts(
    entries: [number, number][],
    ids: number[],
    allImages: { id: number; order: number; productId: number }[],
  ): void {
    const other = allImages.filter((img) => !ids.includes(img.id));
    const occupiedByOther = new Map<number, number>();
    for (const img of other) occupiedByOther.set(img.order, img.id);

    for (const [, newOrder] of entries) {
      const conflictWith = occupiedByOther.get(newOrder);
      if (conflictWith !== undefined) {
        throw new BadRequestException(
          `Order ${newOrder} is already used by image ${conflictWith}. ` +
            `Include that image in the payload to swap, or choose a different order.`,
        );
      }
    }
  }

  async checkOwnership(imageId: number, productId: number): Promise<boolean>;
  async checkOwnership(imageIds: number[], productId: number): Promise<boolean>;
  async checkOwnership(
    imageIds: number | number[],
    productId: number,
  ): Promise<boolean> {
    const ids = Array.isArray(imageIds) ? imageIds : [imageIds];
    if (!ids.length) return false;

    const count = await this.imagesRepository.countManyByProduct(
      ids,
      productId,
    );
    return count === ids.length;
  }

  async deleteImagesByProductId(productId: number) {
    const folderPath = `${PRODUCT_IMAGES_PREFIX}/${productId}/`;
    await this.s3Service.deleteFolder(folderPath);
    await this.imagesRepository.deleteByProductId(productId);
  }
  async deleteImage(imageId: number) {
    const image = await this.imagesRepository.findById(imageId);
    if (!image) {
      throw new BadRequestException(`Image with ID ${imageId} not found`);
    }

    await this.s3Service.deleteFile(image.url);

    return this.imagesRepository.deleteById(imageId);
  }
}
