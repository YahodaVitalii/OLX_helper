import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from '../../auth/auth.decorator';
import { ProductImagesService } from './product-images.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';
import { ProductImageOwnershipGuard } from './guards/product-image-ownership.guard';

@ApiTags('Product Images')
@Controller('products/:productId/images')
@Auth()
@UseGuards(ProductImageOwnershipGuard)
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload images for a product (max 8)' })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'ID of the product',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('image', 8))
  async uploadProductImages(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productImagesService.saveImages(productId, files);
  }

  @Delete('delete/:imageId')
  @ApiOperation({ summary: 'Delete a specific image of a product' })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'ID of the product',
  })
  @ApiParam({ name: 'imageId', type: Number, description: 'ID of the image' })
  async deleteImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.productImagesService.deleteImage(imageId);
  }

  @Patch('replace')
  @ApiOperation({ summary: 'Replace multiple images with new ones' })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'ID of the product',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
        targetImageIds: {
          type: 'string',
          description: 'JSON array of image IDs to replace',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('image'))
  async replaceImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('targetImageIds') targetImageIds: string,
  ) {
    if (!files.length) {
      throw new BadRequestException('No files uploaded');
    }

    const ids: number[] = JSON.parse(targetImageIds) as number[];

    console.log(ids.length);
    console.log(files.length);

    if (ids.length !== files.length) {
      throw new BadRequestException(
        'Number of images and target IDs must match',
      );
    }

    return this.productImagesService.replaceImages(ids, files);
  }

  @Patch('order')
  @ApiOperation({ summary: 'Change the order of product images' })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'ID of the product',
  })
  async changeOrder(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() orderMap: Record<number, number>,
  ) {
    return this.productImagesService.changeOrder(productId, orderMap);
  }
}
