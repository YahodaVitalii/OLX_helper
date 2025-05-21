import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { PrismaService } from '../../../prisma.service';
import { ProductImagesRepository } from './product-images.repository';

@Module({
  providers: [ProductImagesService, ProductImagesRepository, PrismaService],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
