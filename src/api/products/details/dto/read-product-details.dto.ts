import { ApiProperty } from '@nestjs/swagger';

export class ReadProductDetailsDto {
  @ApiProperty({ example: 1, description: 'ID of the product details' })
  id: number;

  @ApiProperty({ example: 15, description: 'Product ID' })
  productId: number;

  @ApiProperty({
    example: 'Intel i7, 16GB RAM, 512GB SSD',
    description: 'Product characteristics',
    required: false,
  })
  characteristics: string | null;

  @ApiProperty({
    example: 'Lightweight, long battery life',
    description: 'Features of the product',
    required: false,
  })
  features: string | null;

  @ApiProperty({
    example: 'No dedicated GPU',
    description: 'Disadvantages of the product',
    required: false,
  })
  disadvantages: string | null;

  @ApiProperty({
    example: 'Charger, carrying case',
    description: 'Included accessories',
    required: false,
  })
  includedAccessories: string | null;
}
