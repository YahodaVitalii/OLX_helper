import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { ProductAdvertService } from './adverts/product-adverts.service';
import { ProductFinancesService } from './finances/product-finances.service';
import { ProductDetailsService } from './details/product-details.service';
import { CreateProductDto } from './product-dto/create-product.dto';
import { ProductStatus, ProductType } from '@prisma/client';
import { UpdateProductDto } from './product-dto/update-product.dto';
import { ProductServiceFactory } from './product.factory';
import { ReadProductDto } from './product-dto/read-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productServiceFactory: ProductServiceFactory,
    @Inject(forwardRef(() => ProductAdvertService))
    private readonly productAdvertService: ProductAdvertService,
    private readonly productFinanceService: ProductFinancesService,
    private readonly productDetailsService: ProductDetailsService,
  ) {}

  async create(
    ProductDto: CreateProductDto,
    generateDescription: boolean,
  ): Promise<ReadProductDto> {
    const { ProductAdvert, ProductDetails, ProductFinance, ...productData } =
      ProductDto;

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

    if (productData.type !== ProductType.OTHER) {
      const handler = this.productServiceFactory.getHandler(productData.type);
      await handler.create(product.id, ProductDto);
    }

    const createdProduct = await this.findOne(product.id);
    await this.assignGeneratedDescription(createdProduct, generateDescription);
    return createdProduct;
  }

  async findAll(userId: number): Promise<ReadProductDto[]> {
    return this.productRepository.findAllByUserId(userId);
  }

  async findOne(id: number): Promise<ReadProductDto> {
    const product = await this.productRepository.findOneById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    generateDescription: boolean,
  ): Promise<ReadProductDto> {
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

    const updatedProduct = await this.findOne(id);

    await this.assignGeneratedDescription(updatedProduct, generateDescription);

    return updatedProduct;
  }

  delete(id: number, deleteAdvert?: boolean) {
    return this.productRepository.delete(id);
  }

  async updateStatus(id: number, status: ProductStatus) {
    return this.productRepository.updateStatus(id, status);
  }

  private async assignGeneratedDescription(
    product: ReadProductDto,
    generateDescription: boolean,
  ): Promise<void> {
    if (product.ProductAdvert) {
      product.ProductAdvert.description =
        await this.productAdvertService.generateDescription(
          product,
          generateDescription,
        );
      product.ProductAdvert.isDescriptionGenerated = true;
    }
  }
}
