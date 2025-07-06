import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductStatus, ProductType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { ExtendedProduct } from './product.type';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    categoryId: number;
    status: ProductStatus;
    userId?: number;
    type: ProductType;
  }): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        status: data.status,
        userId: data.userId,
        type: data.type,
      },
    });
  }
  async isProductOwnedByUser(
    productId: number,
    userId: number,
  ): Promise<boolean> {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    return !!product;
  }
  async findAllByUserId(userId: number): Promise<ExtendedProduct[]> {
    return this.prisma.product.findMany({
      where: {
        userId,
        Laptop: {
          isNot: null,
        },
      },
      include: {
        ProductAdvert: true,
        ProductDetails: true,
        ProductFinance: true,
        Laptop: true,
        images: true,
      },
    });
  }

  async findOneById(id: number): Promise<ExtendedProduct> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        Laptop: {
          isNot: null,
        },
      },
      include: {
        ProductAdvert: true,
        ProductDetails: true,
        ProductFinance: true,
        Laptop: true,
        images: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found for user`);
    }

    return product;
  }
  async update(id: number, data: Partial<Product>): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        categoryId: data.categoryId,
        status: data.status,
        type: data.type,
      },
    });
  }
  async delete(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async updateStatus(id: number, status: ProductStatus) {
    return this.prisma.product.update({
      where: { id },
      data: { status },
    });
  }
}
