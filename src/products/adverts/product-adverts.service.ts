import { Injectable } from '@nestjs/common';
import { CreateProductAdvertDto } from './dto/create-product-advert.dto';
import { ProductAdvert } from '@prisma/client';
import { ProductAdvertRepository } from './product-adverts.reposetory';

@Injectable()
export class ProductAdvertService {
  constructor(private productAdvertRepository: ProductAdvertRepository) {}

  async createProductAdvert(
    createProductAdvertDto: CreateProductAdvertDto,
  ): Promise<ProductAdvert> {
    return this.productAdvertRepository.create(createProductAdvertDto);
  }
}
