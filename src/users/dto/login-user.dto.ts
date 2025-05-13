import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'user123', description: 'Unique username' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 20, { message: 'Must be between 4 and 20 characters long' })
  readonly username: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'Must be between 4 and 16 characters long' })
  readonly password: string;
}
