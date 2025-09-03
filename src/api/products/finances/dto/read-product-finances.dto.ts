import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ReadProductFinanceDto {
  @ApiProperty({
    description: 'The ID of the product finance record',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'The associated product ID',
    example: 10,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  productId: number | null;

  @ApiProperty({
    description: 'Purchase price of the product',
    example: 100,
  })
  @IsNotEmpty()
  purchasePrice: Decimal;

  @ApiProperty({
    description: 'Selling price of the product',
    example: 150,
  })
  @IsOptional()
  sellingPrice: Decimal;

  @ApiProperty({
    description: 'Additional costs of the product',
    example: 10,
  })
  @IsOptional()
  additionalCosts: Decimal;

  @ApiProperty({
    description: 'Calculated profit from the sale',
    example: 40,
  })
  @IsOptional()
  profit: Decimal;

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2025-09-02T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2025-09-02T12:30:00Z',
  })
  updatedAt: Date;
}
