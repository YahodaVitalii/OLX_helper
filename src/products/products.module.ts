import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductFinancesModule } from './finances/product-finances.module';
import { ProductAdvertsModule } from './adverts/product-adverts.module';
import { ProductDetailsModule } from './details/product-details.module';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [ProductFinancesModule, ProductAdvertsModule, ProductDetailsModule],
})
export class ProductsModule {}
