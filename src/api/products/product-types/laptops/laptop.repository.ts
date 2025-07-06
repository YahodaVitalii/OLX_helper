import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';
import { PrismaService } from '../../../../prisma.service';

@Injectable()
export class LaptopsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(productId: number, createLaptopDto: CreateLaptopDto) {
    return this.prisma.laptop.create({
      data: {
        ...createLaptopDto,
        product: {
          connect: { id: productId },
        },
      },
    });
  }

  async findOne(productId: number) {
    const laptop = await this.prisma.laptop.findUnique({
      where: { productId },
    });

    if (!laptop) {
      throw new NotFoundException(
        `Laptop with productId ${productId} not found`,
      );
    }

    return laptop;
  }

  async update(productId: number, updateLaptopDto: UpdateLaptopDto) {
    return this.prisma.laptop.update({
      where: { productId },
      data: updateLaptopDto,
    });
  }
}
