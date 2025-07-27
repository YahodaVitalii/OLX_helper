import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductAdvertDto {
  @ApiProperty({
    description: 'The ID of the advertisement to be updated',
    example: 1,
  })
  @IsNumber()
  id?: number;

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
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The description of the advertisement',
    example: 'A powerful laptop with great battery life.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    description: 'Whether the description was generated automatically',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDescriptionGenerated?: boolean;
}
