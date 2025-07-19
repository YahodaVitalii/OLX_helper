import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus, ProductType } from '@prisma/client';

export class ReadProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty({ enum: ProductStatus })
  status: ProductStatus;

  @ApiProperty({ enum: ProductType })
  type: ProductType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  userId?: number | null;

  @ApiProperty({ description: 'Product Advert', type: Object, required: false })
  ProductAdvert?: any;

  @ApiProperty({
    description: 'Product Details',
    type: Object,
    required: false,
  })
  ProductDetails?: any;

  @ApiProperty({
    description: 'Product Finance',
    type: Object,
    required: false,
  })
  ProductFinance?: any;

  @ApiProperty({
    description: 'Laptop specific fields',
    type: Object,
    required: false,
  })
  Laptop?: any;

  @ApiProperty({ description: 'Product images', type: [Object] })
  images: any[];
}
