import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductFinancesModule } from './finances/product-finances.module';
import { ProductAdvertsModule } from './adverts/product-adverts.module';
import { ProductDetailsModule } from './details/product-details.module';
import { PrismaService } from '../../prisma.service';
import { ProductImagesModule } from './images/product-images.module';
import { ProductRepository } from './products.repository';
import { ProductServiceFactory } from './product.factory';
import { LaptopsModule } from './product-types/laptops/laptops.module';
import { DescriptionGeneratorModule } from '../../description-generator/description-generator.module';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductService,
    PrismaService,
    ProductRepository,
    ProductServiceFactory,
  ],
  imports: [
    ProductFinancesModule,
    forwardRef(() => ProductAdvertsModule),
    forwardRef(() => DescriptionGeneratorModule),
    ProductDetailsModule,
    ProductImagesModule,
    LaptopsModule,
  ],
  exports: [ProductService],
})
export class ProductsModule {}
