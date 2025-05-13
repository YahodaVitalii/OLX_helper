import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateLaptopDto {
  @ApiProperty({ description: 'Brand of the laptop', example: 'Dell' })
  @IsNotEmpty()
  @IsString()
  brand: string;

  @ApiProperty({
    description: 'Sub-brand of the laptop (if applicable)',
    example: 'Inspiron 15',
    required: false,
  })
  @IsOptional()
  @IsString()
  subBrand?: string;

  @ApiProperty({
    description: 'Model of the laptop',
    example: 'e3000',
  })
  @IsNotEmpty()
  @IsString()
  model: string;

  @ApiProperty({
    description: 'Screen expansion details',
    example: 'Full HD',
    required: false,
  })
  @IsOptional()
  @IsString()
  screenExpansion?: string;

  @ApiProperty({ description: 'Screen size in inches', example: 15.6 })
  @IsNotEmpty()
  @IsNumber()
  screenSize: number;

  @ApiProperty({ description: 'Screen refresh rate in Hz', example: 60 })
  @IsNotEmpty()
  @IsNumber()
  screenRefereshRate: number;

  @ApiProperty({
    description: 'Battery status of the laptop',
    example: 'Working',
  })
  @IsNotEmpty()
  @IsString()
  batteryStatus: string;

  @ApiProperty({ description: 'Battery wear percentage', example: 10 })
  @IsNotEmpty()
  @IsNumber()
  batteryWear: number;

  @ApiProperty({ description: 'Processor type', example: 'Intel' })
  @IsNotEmpty()
  @IsString()
  processor: string;

  @ApiProperty({ description: 'Processor model', example: 'Core i7-1165G7' })
  @IsNotEmpty()
  @IsString()
  processorModel: string;

  @ApiProperty({ description: 'RAM size in GB', example: 16 })
  @IsNotEmpty()
  @IsNumber()
  ramSize: number;

  @ApiProperty({
    description: 'Graphic card details',
    example: 'NVIDIA GeForce GTX 1650',
  })
  @IsNotEmpty()
  @IsString()
  graphicCard: string;

  @ApiProperty({
    description: 'Whether the laptop includes a charger',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  chargerCompletion?: boolean;

  @ApiProperty({ description: 'Hard drive details', example: '512GB SSD' })
  @IsNotEmpty()
  @IsString()
  hardDrive: string;
}
