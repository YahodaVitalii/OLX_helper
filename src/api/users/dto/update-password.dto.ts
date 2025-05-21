import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'oldpassword123',
    description: 'Old password for the user',
  })
  @IsString()
  @Length(4, 16, { message: 'Password must be between 4 and 16 characters' })
  @IsNotEmpty()
  readonly oldPassword: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'New password for the user',
  })
  @IsString()
  @Length(4, 16, { message: 'Password must be between 4 and 16 characters' })
  @IsNotEmpty()
  readonly newPassword: string;
}
