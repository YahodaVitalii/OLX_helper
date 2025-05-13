import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateProductAdvertDto } from './dto/create-product-advert.dto';
import { ProductAdvert } from '@prisma/client';

@Injectable()
export class ProductAdvertRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductAdvertDto: CreateProductAdvertDto,
  ): Promise<ProductAdvert> {
    const { productId, ...advertData } = createProductAdvertDto;

    return this.prisma.productAdvert.create({
      data: {
        ...advertData,
        Product: {
          connect: { id: productId },
        },
      },
    });
  }
}
