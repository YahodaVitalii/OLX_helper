import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateProductAdvertDto } from './dto/create-product-advert.dto';
import { ProductAdvert } from '@prisma/client';

@Injectable()
export class ProductAdvertRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    productId: number,
    createProductAdvertDto: CreateProductAdvertDto,
  ): Promise<ProductAdvert> {
    return this.prisma.productAdvert.create({
      data: {
        ...createProductAdvertDto,
        Product: {
          connect: { id: productId },
        },
      },
    });
  }
  async findOneById(id: number): Promise<ProductAdvert | null> {
    return this.prisma.productAdvert.findFirst({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    productAdvert: Partial<ProductAdvert>,
  ): Promise<ProductAdvert> {
    return this.prisma.productAdvert.update({
      where: { id },
      data: productAdvert,
    });
  }
  async updateByProductId(
    productId: number,
    productAdvert: Partial<ProductAdvert>,
  ): Promise<ProductAdvert> {
    return this.prisma.productAdvert.update({
      where: { productId },
      data: productAdvert,
    });
  }
  async updateDescription(id: number, description: string): Promise<ProductAdvert> {
    return this.prisma.productAdvert.update({
      where: { id },
      data: { description },
    });
  }
}
