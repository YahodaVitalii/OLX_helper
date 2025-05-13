import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@gmail.com',
    required: false,
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User username',
    example: 'user123',
    required: false,
  })
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'User city of residence',
    example: 'New York',
    required: false,
  })
  @IsString()
  city?: string;
}
