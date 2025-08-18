import { Injectable } from '@nestjs/common';
import { ProductImagesRepository } from './product-images.repository';
import { S3Service } from '../../../s3/s3.service';

@Injectable()
export class ProductImagesService {
  constructor(
    private readonly imagesRepository: ProductImagesRepository,
    private readonly s3Service: S3Service,
  ) {}

  async saveImages(productId: number, images: Express.Multer.File[]) {
    const uploadedImages = await Promise.all(
      images.map(async (file, index) => {
        const key = `products/${productId}/${Date.now()}-${index}-${file.originalname}`;
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
}
