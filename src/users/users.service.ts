import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { User } from '@prisma/client';
import { hashPassword } from '../utils/hashPassword';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { comparePassword } from '../utils/comparePassword';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(user: CreateUserDto): Promise<User> {
    user.password = await hashPassword(user.password); // Хешування пароля

    return await this.usersRepository.create(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async getUserByLogin(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<ReadUserDto> {
    const user: User | null = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const isOldPasswordCorrect = await comparePassword(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedPassword = await hashPassword(updatePasswordDto.newPassword);

    return await this.usersRepository.updatePassword(id, hashedPassword);
  }
  async getUserById(id: number): Promise<ReadUserDto | null> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      return null;
    }
    return plainToInstance(ReadUserDto, user); // Перетворюємо на ReadUserDto
  }
}
