import { Injectable } from '@nestjs/common';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';
import { ProductServiceInterface } from '../../abstract-product-service.interface';
import { Laptop } from '@prisma/client';
import { LaptopsRepository } from './laptop.repository';
import { CreateProductDto } from '../../product-dto/create-product.dto';
import { UpdateProductDto } from '../../product-dto/update-product.dto';

@Injectable()
export class LaptopsService implements ProductServiceInterface {
  constructor(private readonly laptopsRepository: LaptopsRepository) {}
  create(
    productId: number,
    createProductDto: CreateProductDto,
  ): Promise<Laptop> {
    const { Laptop } = createProductDto;

    return this.laptopsRepository.create(productId, Laptop as CreateLaptopDto);
  }

  findOne(productId: number): Promise<Laptop> {
    return this.laptopsRepository.findOne(productId);
  }

  update(
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Laptop> {
    const { Laptop } = updateProductDto;

    return this.laptopsRepository.update(productId, Laptop as UpdateLaptopDto);
  }
}
