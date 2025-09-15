import { IsString } from 'class-validator';

export class UpsertNovaPoshtaSettingsDto {
  @IsString()
  apiKey: string;

  @IsString()
  senderRef: string;

  @IsString()
  cityRef: string;
}
