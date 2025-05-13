import { Module } from '@nestjs/common';
import { ProductDetailsService } from './product-details.service';
import { ProductDetailsRepository } from './product-details.repository';
import { PrismaService } from '../../prisma.service';

@Module({
  providers: [ProductDetailsService, PrismaService, ProductDetailsRepository],
})
export class ProductDetailsModule {}
