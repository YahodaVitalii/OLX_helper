import { Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ProductFinancesService } from './product-finances.service';
import { ProductFinancesRepository } from './product-finances.repository';

@Module({
  providers: [ProductFinancesService, PrismaService, ProductFinancesRepository],
  exports: [ProductFinancesService],
})
export class ProductFinancesModule {}
