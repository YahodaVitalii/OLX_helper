import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async update(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<ReadUserDto> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        phoneNumber: true,
        city: true,
      },
    });

    return plainToClass(ReadUserDto, updatedUser);
  }
  async updatePassword(id: number, newPassword: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { password: newPassword }, // Оновлюємо пароль
    });
  }
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
