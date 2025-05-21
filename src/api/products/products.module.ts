import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductFinancesModule } from './finances/product-finances.module';
import { ProductAdvertsModule } from './adverts/product-adverts.module';
import { ProductDetailsModule } from './details/product-details.module';
import { PrismaService } from '../../prisma.service';
import { ProductImagesModule } from './images/product-images.module';
import { ProductRepository } from './products.repository';

@Module({
  controllers: [ProductsController],
  providers: [ProductService, PrismaService, ProductRepository],
  imports: [
    ProductFinancesModule,
    ProductAdvertsModule,
    ProductDetailsModule,
    ProductImagesModule,
  ],
})
export class ProductsModule {}
