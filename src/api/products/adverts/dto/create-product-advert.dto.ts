import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductAdvertDto {
  @ApiProperty({
    description: 'The OLX listing ID (if applicable)',
    example: 123456789,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  olxId?: number;

  @ApiProperty({
    description: 'The title of the advertisement',
    example: 'Amazing Laptop for Sale',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the advertisement',
    example: 'A powerful laptop with great battery life.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
