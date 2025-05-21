import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ProductFinance } from '@prisma/client';
import { CreateProductFinanceDto } from './dto/create-product-finance.dto';
import { UpdateProductFinanceDto } from './dto/update-product-finance.dto';

@Injectable()
export class ProductFinancesRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    productId: number,
    createProductFinanceDto: CreateProductFinanceDto,
  ): Promise<ProductFinance> {
    return this.prisma.productFinance.create({
      data: {
        productId: productId,
        purchasePrice: createProductFinanceDto.purchasePrice,
        sellingPrice: createProductFinanceDto.sellingPrice || 0,
        additionalCosts: createProductFinanceDto.additionalCosts || 0,
        profit: createProductFinanceDto.profit || 0,
      },
    });
  }

  async updateByProductId(
    productId: number,
    ProductFinance: UpdateProductFinanceDto,
  ): Promise<ProductFinance> {
    return this.prisma.productFinance.update({
      where: { productId },
      data: ProductFinance,
    });
  }
}
