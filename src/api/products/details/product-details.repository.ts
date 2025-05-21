import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ProductDetails } from '@prisma/client';
import { ProductDetailsDto } from './dto/product-details.dto';

@Injectable()
export class ProductDetailsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    productId: number,
    productDetailsDto: ProductDetailsDto,
  ): Promise<ProductDetails> {
    return this.prisma.productDetails.create({
      data: {
        ...productDetailsDto,
        Product: {
          connect: { id: productId },
        },
      },
    });
  }

  async updateByProductId(
    productId: number,
    productDetailsDto: ProductDetailsDto,
  ): Promise<ProductDetails> {
    return this.prisma.productDetails.update({
      where: { productId },
      data: productDetailsDto,
    });
  }
}
