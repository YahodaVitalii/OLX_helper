import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductFinanceDto {
  @ApiProperty({
    description: 'The purchase price of the product',
    example: 500,
  })
  @IsNotEmpty()
  @IsNumber()
  purchasePrice: Decimal;

  @ApiProperty({
    description: 'The selling price of the product (default: 0)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  sellingPrice?: Decimal;

  @ApiProperty({
    description: 'Additional costs incurred (default: 0)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  additionalCosts?: Decimal;

  @ApiProperty({
    description: 'Calculated profit from the sale (default: 0)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  profit?: Decimal;
}
