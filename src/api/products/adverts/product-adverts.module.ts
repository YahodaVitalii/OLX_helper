import { Module } from '@nestjs/common';
import { ProductAdvertRepository } from './product-adverts.repository';
import { ProductAdvertService } from './product-adverts.service';
import { PrismaService } from '../../../prisma.service';

@Module({
  providers: [ProductAdvertService, PrismaService, ProductAdvertRepository],
  exports: [ProductAdvertService],
})
export class ProductAdvertsModule {}
