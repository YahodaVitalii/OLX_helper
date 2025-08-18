import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from '../../auth/auth.decorator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import { ProductImagesService } from './product-images.service';

@Controller('products')
@Auth()
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post(':productId/upload-images')
  @UseInterceptors(FilesInterceptor('images', 8))
  async uploadProductImages(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productImagesService.saveImages(productId, files);
  }
}
