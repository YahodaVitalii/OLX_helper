import { ApiProperty } from '@nestjs/swagger';

export class ReadNovaPoshtaSettingsDto {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the Nova Poshta settings record',
  })
  id: number;

  @ApiProperty({
    example: 42,
    description: 'ID of the user these settings belong to',
  })
  userId: number;

  @ApiProperty({
    example: '2e9c62f73f7b6c64d97c0e36abcd1234',
    description: 'Personal Nova Poshta API key for the user',
  })
  apiKey: string;

  @ApiProperty({
    example: 'db5c88f3-067a-11e5-ad08-005056801333',
    description: 'Nova Poshta unique reference for the sender',
  })
  senderRef: string;

  @ApiProperty({
    example: '8d5a980d-391c-11dd-90d9-001a92567626',
    description: 'Nova Poshta unique reference for the sender’s city',
  })
  cityRef: string;
}
