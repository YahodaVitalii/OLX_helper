import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'Email address' })
  @IsString()
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'user123', description: 'Unique username' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 20, { message: 'Must be between 4 and 20 characters long' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @IsString({ message: 'Must be a string' })
  @Length(4, 16, { message: 'Must be between 4 and 16 characters long' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  @IsString({ message: 'Must be a string' })
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  readonly phoneNumber: string;

  @ApiProperty({ example: 'New York', description: 'City of residence' })
  @IsString({ message: 'Must be a string' })
  @IsNotEmpty()
  readonly city: string;
}
