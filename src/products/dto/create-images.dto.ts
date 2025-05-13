import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({
    description: 'URL of the image',
    example: 'https://example.com/image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  url: string;
}
