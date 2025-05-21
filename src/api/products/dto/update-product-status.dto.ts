import { IsEnum } from 'class-validator';
import { ProductStatus } from '@prisma/client'; // або де у вас описаний enum

export class UpdateProductStatusDto {
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
