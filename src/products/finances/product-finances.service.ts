import { Injectable } from '@nestjs/common';
import { ProductFinancesRepository } from './product-finances.repository';
import { CreateProductFinanceDto } from './dto/create-product-finance.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductFinancesService {
  constructor(private productFinancesRepository: ProductFinancesRepository) {}

  async create(ProductFinanceDto: CreateProductFinanceDto) {
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

    return this.productFinancesRepository.create({
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
}
