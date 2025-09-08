import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty({
    example: 5,
    description: 'The ID of the product to be shipped',
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: '42',
    description: 'Nova Poshta City Ref of the recipient',
  })
  @IsString()
  @IsNotEmpty()
  recipientCityRef: string;

  @ApiProperty({
    example: 'f7d1b5a0-9b8d-11e9-8c8f-00505601005a',
    description: 'Nova Poshta Address Ref of the recipient',
  })
  @IsString()
  @IsNotEmpty()
  recipientAddressRef: string;

  @ApiProperty({
    example: '+380981234567',
    description: 'Recipient phone number',
  })
  @IsString()
  @IsNotEmpty()
  recipientPhone: string;

  @ApiProperty({
    example: 'Ivan Petrenko',
    description: 'Full name of the recipient',
  })
  @IsString()
  @IsNotEmpty()
  recipientName: string;
}
