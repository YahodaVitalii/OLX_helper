import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNovaPoshtaSettingsDto {
  @ApiProperty({
    description: 'Personal Nova Poshta API key',
    example: '51717777d45837c77664f21a0680c74d',
  })
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty({
    description: 'Sender city name (used to find cityRef)',
    example: 'Kyiv',
  })
  @IsString()
  @IsNotEmpty()
  cityName: string;
}
