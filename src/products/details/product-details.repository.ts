import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ProductDetails } from '@prisma/client';
import { ProductDetailsDto } from './dto/product-details.dto';

@Injectable()
export class ProductDetailsRepository {
  constructor(private prisma: PrismaService) {}

  async create(productDetailsDto: ProductDetailsDto): Promise<ProductDetails> {
    const { productId, ...details } = productDetailsDto;

    return this.prisma.productDetails.create({
      data: {
        ...details,
        Product: {
          connect: { id: productId },
        },
      },
    });
  }
}
