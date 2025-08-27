import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { PrismaService } from '../../../prisma.service';
import { ProductImagesRepository } from './product-images.repository';
import { ProductImagesController } from './product-image.controller';
import { S3Module } from '../../../s3/s3.module';

@Module({
  controllers: [ProductImagesController],
  providers: [ProductImagesService, ProductImagesRepository, PrismaService],
  exports: [ProductImagesService],
  imports: [S3Module],
})
export class ProductImagesModule {}
