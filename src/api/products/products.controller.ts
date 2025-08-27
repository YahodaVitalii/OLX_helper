import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  Patch,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { ProductService } from './products.service';
import { CreateProductDto } from './product-dto/create-product.dto';
import { Auth } from '../auth/auth.decorator';
import { RequestUserContext } from '../../types/Express/req-user-context.interface';
import { UpdateProductDto } from './product-dto/update-product.dto';
import { OwnerGuard } from './product-owner.guard';
import { UpdateProductStatusDto } from './product-dto/update-product-status.dto';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({
    name: 'generateDescription',
    required: false,
    type: Boolean,
    description: 'Whether to generate a description automatically',
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: RequestUserContext,
    @Query('generateDescription', ParseBoolPipe) generateDescription?: boolean,
  ) {
    const userId = req.user.userId;
    return this.productsService.create(
      { ...createProductDto, userId },
      generateDescription ?? false,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all products of the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully.',
  })
  findAll(@Req() req: RequestUserContext) {
    const userId = req.user.userId;
    return this.productsService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: Number })
  @ApiResponse({ status: 200, description: 'Product found.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Not owner of the product.',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Update a product by id' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: Number })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Not owner of the product.',
  })
  @ApiQuery({
    name: 'generateDescription',
    required: false,
    type: Boolean,
    description: 'Whether to generate a description automatically',
  })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Query('generateDescription', ParseBoolPipe) generateDescription?: boolean,
  ) {
    return this.productsService.update(
      +id,
      updateProductDto,
      generateDescription ?? false,
    );
  }
  @Patch(':id/status')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Update product status' })
  @ApiResponse({
    status: 200,
    description: 'Product status updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiOperation({ summary: 'Update product status' })
  @ApiResponse({
    status: 200,
    description: 'Product status updated successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateProductStatusDto: UpdateProductStatusDto,
  ) {
    return this.productsService.updateStatus(
      +id,
      updateProductStatusDto.status,
    );
  }
  @Delete(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiParam({ name: 'id', description: 'ID of the product', type: Number })
  @ApiQuery({
    name: 'deleteAdvert',
    required: false,
    type: Boolean,
    description: 'Whether to delete the advert along with the product',
  })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Not owner of the product.',
  })
  remove(
    @Param('id') id: string,
    @Query('deleteAdvert', ParseBoolPipe) deleteAdvert?: boolean,
  ) {
    return this.productsService.delete(+id, deleteAdvert as boolean);
  }
}
