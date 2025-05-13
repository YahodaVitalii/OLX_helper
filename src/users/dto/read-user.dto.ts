import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ReadUserDto {
  @ApiProperty({ example: '1', description: 'User ID' })
  readonly id: number;

  @ApiProperty({ example: 'user@gmail.com', description: 'Email address' })
  readonly email: string;

  @ApiProperty({ example: 'user123', description: 'Unique username' })
  readonly username: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  readonly name: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number' })
  readonly phoneNumber: string;

  @ApiProperty({ example: 'New York', description: 'City of residence' })
  readonly city: string;

  @Exclude()
  readonly password: string;
}
