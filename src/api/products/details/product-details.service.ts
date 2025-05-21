import { Injectable } from '@nestjs/common';
import { ProductDetailsDto } from './dto/product-details.dto';
import { ProductDetailsRepository } from './product-details.repository';
import { ProductDetails } from '@prisma/client';

@Injectable()
export class ProductDetailsService {
  constructor(private productDetailsRepository: ProductDetailsRepository) {}

  async createProductDetails(
    productId: number,
    productDetailsDto: ProductDetailsDto,
  ): Promise<ProductDetails> {
    return this.productDetailsRepository.create(productId, productDetailsDto);
  }
  async updateProductDetailsByProductId(
    productId: number,
    productDetailsDto: ProductDetailsDto,
  ): Promise<ProductDetails> {
    return this.productDetailsRepository.updateByProductId(
      productId,
      productDetailsDto,
    );
  }
}
