import { ApiProperty } from '@nestjs/swagger';

export class ProductImageDto {
  @ApiProperty({ example: 1, description: 'Unique ID of the image' })
  id: number;

  @ApiProperty({
    example: 3,
    description: 'ID of the product this image belongs to',
  })
  productId: number;

  @ApiProperty({ example: 'https://...', description: 'URL of the image' })
  url: string;

  @ApiProperty({ example: 1, description: 'Order index of the image' })
  order: number;

  @ApiProperty({
    example: '2025-08-21T12:00:00Z',
    description: 'Creation timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-08-21T12:10:00Z',
    description: 'Last update timestamp',
  })
  updatedAt: Date;
}
