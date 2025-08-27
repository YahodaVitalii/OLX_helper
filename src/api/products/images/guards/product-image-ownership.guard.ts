import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductImagesService } from '../product-images.service';
import { ProductImageRequest } from '../../../../types/Express/product-image-request.interface';

@Injectable()
export class ProductImageOwnershipGuard implements CanActivate {
  constructor(private readonly productImagesService: ProductImagesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ProductImageRequest>();
    const { productId, imageId } = request.params;

    // If route uses imageId -> validate that image belongs to productId
    if (imageId) {
      const belongs = await this.productImagesService.checkOwnership(
        +imageId,
        +productId,
      );
      if (!belongs) {
        throw new NotFoundException(
          `Image ${imageId} does not belong to product ${productId}`,
        );
      }
    }

    // If request has targetImageIds (replaceImages)
    if (request.body?.targetImageIds) {
      let ids: number[];
      try {
        ids = JSON.parse(request.body.targetImageIds) as number[];
      } catch {
        throw new BadRequestException('Invalid targetImageIds format');
      }

      const allBelong = await this.productImagesService.checkOwnership(
        ids,
        +productId,
      );

      if (!allBelong) {
        throw new NotFoundException(
          `Some target images do not belong to product ${productId}`,
        );
      }
    }

    return true;
  }
}
