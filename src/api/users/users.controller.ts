import {
  Controller,
  Body,
  Post,
  Put,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from '../auth/auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'Creating users' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({
    status: 409,
    description: 'A user with this email already exists.',
  })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Updating user' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth()
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return this.usersService.updateUser(id, user);
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth()
  @Patch(':id/password')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<ReadUserDto> {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: ReadUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth()
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadUserDto> {
    const user: ReadUserDto | null = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth()
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
