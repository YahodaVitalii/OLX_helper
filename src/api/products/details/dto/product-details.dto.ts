import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductDetailsDto {
  @ApiProperty({
    description: 'A summary or main section of the product details',
    example: 'Hello! Asus ROG G751J laptop for sale.',
  })
  @IsOptional()
  @IsString()
  characteristics?: string;

  @ApiProperty({
    description: 'A list of the product’s features',
    example: '["Backlit keyboard", "High performance"]',
  })
  @IsOptional()
  @IsString()
  features?: string;

  @ApiProperty({
    description: 'A list of the product’s disadvantages or defects',
    example: '["Does not power on", "Power button blinks"]',
  })
  @IsOptional()
  @IsString()
  disadvantages?: string;

  @ApiProperty({
    description: 'A list of accessories included with the product',
    example: '["Original charger", "Laptop bag"]',
  })
  @IsOptional()
  @IsString()
  includedAccessories?: string;
}
