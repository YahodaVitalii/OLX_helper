import { BadRequestException, Injectable } from '@nestjs/common';
import { LaptopsService } from './product-types/laptops/laptops.service';
import { ProductType } from '@prisma/client';
import { ProductServiceInterface } from './abstract-product-service.interface';

@Injectable()
export class ProductServiceFactory {
  constructor(private readonly laptopService: LaptopsService) {}

  getHandler(type: ProductType): ProductServiceInterface {
    switch (type) {
      case ProductType.LAPTOP:
        return this.laptopService;
      default:
        throw new BadRequestException(`Type: ${type} is not supported`);
    }
  }
}
