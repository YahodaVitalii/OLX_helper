import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { ProductAdvertService } from './adverts/product-adverts.service';
import { ProductFinancesService } from './finances/product-finances.service';
import { ProductDetailsService } from './details/product-details.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus, ProductType } from '@prisma/client';
import { ProductImagesService } from './images/product-images.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductServiceFactory } from './product.factory';
import { ExtendedProduct } from './product.type';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productServiceFactory: ProductServiceFactory,
    private readonly productAdvertService: ProductAdvertService,
    private readonly productFinanceService: ProductFinancesService,
    private readonly productDetailsService: ProductDetailsService,
    private readonly productImagesService: ProductImagesService,
  ) {}

  async create(ProductDto: CreateProductDto): Promise<ExtendedProduct> {
    const {
      ProductAdvert,
      ProductDetails,
      ProductFinance,
      images,
      ...productData
    } = ProductDto;

    const product = await this.productRepository.create(productData);

    if (ProductAdvert) {
      await this.productAdvertService.createProductAdvert(
        product.id,
        ProductAdvert,
      );
    }

    if (ProductDetails) {
      await this.productDetailsService.createProductDetails(
        product.id,
        ProductDetails,
      );
    }

    if (ProductFinance) {
      await this.productFinanceService.create(product.id, ProductFinance);
    }

    if (images) {
      await this.productImagesService.addImages(product.id, images);
    }

    if (productData.type !== ProductType.OTHER) {
      const handler = this.productServiceFactory.getHandler(productData.type);
      await handler.create(product.id, ProductDto);
    }

    return this.findOne(product.id);
  }

  async findAll(userId: number): Promise<ExtendedProduct[]> {
    return this.productRepository.findAllByUserId(userId);
  }

  async findOne(id: number): Promise<ExtendedProduct> {
    const product = await this.productRepository.findOneById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ExtendedProduct> {
    const { ProductAdvert, ProductDetails, ProductFinance, ...productData } =
      updateProductDto;

    await this.productRepository.update(id, productData);

    if (ProductAdvert) {
      await this.productAdvertService.updateProductAdvertByProductId(
        id,
        ProductAdvert,
      );
    }

    if (ProductDetails) {
      await this.productDetailsService.updateProductDetailsByProductId(
        id,
        ProductDetails,
      );
    }

    if (ProductFinance) {
      await this.productFinanceService.updateProductFinanceByProductId(
        id,
        ProductFinance,
      );
    }

    if (productData.type !== ProductType.OTHER) {
      const handler = this.productServiceFactory.getHandler(productData.type);
      await handler.update(id, updateProductDto);
    }

    return this.findOne(id);
  }

  delete(id: number, deleteAdvert?: boolean) {
    return this.productRepository.delete(id);
  }

  async updateStatus(id: number, status: ProductStatus) {
    return this.productRepository.updateStatus(id, status);
  }
}
