import { Injectable } from '@nestjs/common';
import { ProductFinancesRepository } from './product-finances.repository';
import { CreateProductFinanceDto } from './dto/create-product-finance.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { UpdateProductFinanceDto } from './dto/update-product-finance.dto';

@Injectable()
export class ProductFinancesService {
  constructor(private productFinancesRepository: ProductFinancesRepository) {}

  async create(productId: number, ProductFinanceDto: CreateProductFinanceDto) {
    const {
      purchasePrice,
      sellingPrice = new Decimal(0),
      additionalCosts = new Decimal(0),
    } = ProductFinanceDto;

    const profit = this.calculateProfit(
      new Decimal(purchasePrice),
      new Decimal(sellingPrice),
      new Decimal(additionalCosts),
    );

    return this.productFinancesRepository.create(productId, {
      ...ProductFinanceDto,
      profit,
    });
  }

  private calculateProfit(
    purchasePrice: Decimal,
    sellingPrice: Decimal,
    additionalCosts: Decimal,
  ): Decimal {
    return sellingPrice.minus(purchasePrice.plus(additionalCosts));
  }

  async updateProductFinanceByProductId(
    productId: number,
    ProductFinance: UpdateProductFinanceDto,
  ) {
    await this.productFinancesRepository.updateByProductId(
      productId,
      ProductFinance,
    );
  }
}
