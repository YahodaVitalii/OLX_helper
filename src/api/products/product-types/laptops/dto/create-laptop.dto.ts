import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { BatteryStatus } from '@prisma/client';

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

  @ApiProperty({ description: 'Model of the laptop', example: 'e3000' })
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

  @ApiProperty({
    description: 'Screen refresh rate in Hz',
    example: 60,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  screenRefreshRate?: number;

  @ApiProperty({
    description: 'Battery status of the laptop',
    example: 'Working',
    required: false,
  })
  @IsOptional()
  @IsString()
  batteryStatus?: BatteryStatus;

  @ApiProperty({
    description: 'Battery wear percentage',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  batteryWear?: number;

  @ApiProperty({
    description: 'Processor type',
    example: 'Intel',
    required: false,
  })
  @IsOptional()
  @IsString()
  processor?: string;

  @ApiProperty({
    description: 'Processor model',
    example: 'Core i7-1165G7',
    required: false,
  })
  @IsOptional()
  @IsString()
  processorModel?: string;

  @ApiProperty({ description: 'RAM size in GB', example: 16, required: false })
  @IsOptional()
  @IsNumber()
  ramSize?: number;

  @ApiProperty({
    description: 'Graphic card details',
    example: 'NVIDIA GeForce GTX 1650',
    required: false,
  })
  @IsOptional()
  @IsString()
  graphicCard?: string;

  @ApiProperty({
    description: 'Whether the laptop includes a charger',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  chargerCompletion?: boolean;

  @ApiProperty({
    description: 'Hard drive details',
    example: '512GB SSD',
    required: false,
  })
  @IsOptional()
  @IsString()
  hardDrive?: string;

  @ApiProperty({
    description: 'Indicates if this is a gaming laptop',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  isGamer: boolean;

  // @ApiProperty({
  //   description: 'Product ID associated with this laptop',
  //   example: 123,
  // })
  // @IsNotEmpty()
  // @IsNumber()
  // productId: number;
}
