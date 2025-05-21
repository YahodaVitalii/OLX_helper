import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus, ProductType } from '@prisma/client';
import { CreateProductAdvertDto } from '../adverts/dto/create-product-advert.dto';
import { CreateProductFinanceDto } from '../finances/dto/create-product-finance.dto';
import { CreateImageDto } from '../images/dto/create-images.dto';
import { CreateLaptopDto } from '../product-types/laptops/dto/create-laptop.dto';
import { ProductDetailsDto } from '../details/dto/product-details.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Laptop Dell Inspiron 15',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The ID of the category the product belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    description: 'The status of the product',
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
  })
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({
    description: 'The type of the product',
    enum: ProductType,
    example: ProductType.LAPTOP,
  })
  @IsNotEmpty()
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    description: 'Details of the product advertisement',
    type: CreateProductAdvertDto,
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateProductAdvertDto)
  ProductAdvert?: CreateProductAdvertDto;

  @ApiProperty({
    description: 'Details of the product',
    type: CreateProductAdvertDto,
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => ProductDetailsDto)
  ProductDetails?: ProductDetailsDto;

  @ApiProperty({
    description: 'Financial details of the product',
    type: CreateProductFinanceDto,
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateProductFinanceDto)
  ProductFinance?: CreateProductFinanceDto;

  @ApiProperty({
    description: 'Array of images associated with the product',
    type: [CreateImageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images?: CreateImageDto[];

  @ApiProperty({
    description: 'Laptop-specific details',
    type: CreateLaptopDto,
    required: false,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => CreateLaptopDto)
  Laptop?: CreateLaptopDto;
}
