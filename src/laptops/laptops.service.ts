import { Injectable } from '@nestjs/common';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';

@Injectable()
export class LaptopsService {
  create(createLaptopDto: CreateLaptopDto) {
    return 'This action adds a new laptop';
  }

  findAll() {
    return `This action returns all laptops`;
  }

  findOne(id: number) {
    return `This action returns a #${id} laptop`;
  }

  update(id: number, updateLaptopDto: UpdateLaptopDto) {
    return `This action updates a #${id} laptop`;
  }

  remove(id: number) {
    return `This action removes a #${id} laptop`;
  }
}
