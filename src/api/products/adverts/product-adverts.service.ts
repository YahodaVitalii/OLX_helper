import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductAdvertDto } from './dto/create-product-advert.dto';
import { ProductAdvert } from '@prisma/client';
import { ProductAdvertRepository } from './product-adverts.repository';
import { UpdateProductAdvertDto } from './dto/update-product-advert.dto';

@Injectable()
export class ProductAdvertService {
  constructor(private productAdvertRepository: ProductAdvertRepository) {}

  async createProductAdvert(
    productId: number,
    productAdvertDto: CreateProductAdvertDto,
  ): Promise<ProductAdvert> {
    return this.productAdvertRepository.create(productId, productAdvertDto);
  }
  async findOne(id: number): Promise<ProductAdvert> {
    const productAdvert = await this.productAdvertRepository.findOneById(id);

    if (!productAdvert) {
      throw new NotFoundException(`ProductAdvert with ID ${id} not found`);
    }

    return productAdvert;
  }
  async updateProductAdvert(
    id: number,
    productAdvertDto: UpdateProductAdvertDto,
  ): Promise<ProductAdvert> {
    return this.productAdvertRepository.update(id, productAdvertDto);
  }
  async updateProductAdvertByProductId(
    productId: number,
    productAdvertDto: UpdateProductAdvertDto,
  ): Promise<ProductAdvert> {
    return await this.productAdvertRepository.updateByProductId(
      productId,
      productAdvertDto,
    );
  }
}
