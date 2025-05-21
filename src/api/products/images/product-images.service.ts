import { Injectable } from '@nestjs/common';
import { ProductImagesRepository } from './product-images.repository';
import { Image } from '@prisma/client';
import { CreateImageDto } from './dto/create-images.dto';

@Injectable()
export class ProductImagesService {
  constructor(private readonly imagesRepository: ProductImagesRepository) {}

  async addImages(
    productId: number,
    imagesDto: CreateImageDto[],
  ): Promise<Image[]> {
    return this.imagesRepository.create(productId, imagesDto);
  }
}
