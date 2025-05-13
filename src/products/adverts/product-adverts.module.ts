import { Module } from '@nestjs/common';
import { ProductAdvertRepository } from './product-adverts.reposetory';
import { ProductAdvertService } from './product-adverts.service';
import { PrismaService } from '../../prisma.service';

@Module({
  providers: [ProductAdvertService, PrismaService, ProductAdvertRepository],
})
export class ProductAdvertsModule {}
