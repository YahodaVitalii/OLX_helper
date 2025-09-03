import { ApiProperty } from '@nestjs/swagger';
import { BatteryStatus } from '@prisma/client';

export class ReadLaptopDto {
  @ApiProperty({ description: 'Unique identifier of the laptop', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID of the associated product', example: 101 })
  productId: number;

  @ApiProperty({ description: 'Laptop brand', example: 'Dell' })
  brand: string;

  @ApiProperty({
    description: 'Sub-brand or series of the laptop',
    example: 'Inspiron',
    required: false,
    nullable: true,
  })
  subBrand?: string | null;

  @ApiProperty({ description: 'Laptop model', example: 'e3000' })
  model: string;

  @ApiProperty({
    description: 'Details about the screen expansion',
    example: 'Full HD',
    required: false,
    nullable: true,
  })
  screenExpansion?: string | null;

  @ApiProperty({ description: 'Screen size in inches', example: 15.6 })
  screenSize: number;

  @ApiProperty({
    description: 'Screen refresh rate in Hz',
    example: 60,
    required: false,
    nullable: true,
  })
  screenRefreshRate?: number | null;

  @ApiProperty({
    description: 'Battery status of the laptop',
    example: 'Working',
    enum: BatteryStatus,
    required: false,
    nullable: true,
  })
  batteryStatus?: BatteryStatus | null;

  @ApiProperty({
    description: 'Battery wear percentage',
    example: 10,
    required: false,
    nullable: true,
  })
  batteryWear?: number | null;

  @ApiProperty({
    description: 'Indicates if this laptop is designed for gaming',
    example: true,
  })
  isGamer: boolean;

  @ApiProperty({
    description: 'Processor manufacturer/type',
    example: 'Intel',
    required: false,
    nullable: true,
  })
  processor?: string | null;

  @ApiProperty({
    description: 'Specific processor model',
    example: 'Core i7-1165G7',
    required: false,
    nullable: true,
  })
  processorModel?: string | null;

  @ApiProperty({
    description: 'Amount of RAM in GB',
    example: 16,
    required: false,
    nullable: true,
  })
  ramSize?: number | null;

  @ApiProperty({
    description: 'Graphics card information',
    example: 'NVIDIA GeForce GTX 1650',
    required: false,
    nullable: true,
  })
  graphicCard?: string | null;

  @ApiProperty({
    description: 'Whether the charger is included',
    example: true,
    required: false,
    nullable: true,
  })
  chargerCompletion?: boolean | null;

  @ApiProperty({
    description: 'Hard drive specifications',
    example: '512GB SSD',
    required: false,
    nullable: true,
  })
  hardDrive?: string | null;
}
