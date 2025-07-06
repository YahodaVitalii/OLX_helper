import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ProductType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'The type of the product',
    enum: ProductType,
    example: ProductType.LAPTOP,
  })
  @IsNotEmpty()
  @IsEnum(ProductType)
  type: ProductType;
}
