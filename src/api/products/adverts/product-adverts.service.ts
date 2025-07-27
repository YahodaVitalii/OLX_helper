import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductAdvertDto } from './dto/create-product-advert.dto';
import { ProductAdvert } from '@prisma/client';
import { ProductAdvertRepository } from './product-adverts.repository';
import { UpdateProductAdvertDto } from './dto/update-product-advert.dto';
import { DescriptionGeneratorService } from '../../../description-generator/description-generator.service';
import { ReadProductDto } from '../product-dto/read-product.dto';

@Injectable()
export class ProductAdvertService {
  constructor(
    private productAdvertRepository: ProductAdvertRepository,
    @Inject(forwardRef(() => DescriptionGeneratorService))
    private descriptionGeneratorService: DescriptionGeneratorService,
  ) {}

  async createProductAdvert(
    productId: number,
    productAdvertDto: CreateProductAdvertDto,
  ): Promise<ProductAdvert> {
    return this.productAdvertRepository.create(productId, productAdvertDto);
  }

  async findOne(id: number): Promise<ProductAdvert> {
    const productAdvert = await this.productAdvertRepository.findOneById(id);

    if (!productAdvert) {
      throw new NotFoundException(`ProductAdvert with ID ${id} not found`);
    }

    return productAdvert;
  }

  async updateProductAdvert(
    id: number,
    productAdvertDto: UpdateProductAdvertDto,
  ): Promise<ProductAdvert> {
    return this.productAdvertRepository.update(id, productAdvertDto);
  }

  async updateProductAdvertByProductId(
    productId: number,
    productAdvertDto: UpdateProductAdvertDto,
  ): Promise<ProductAdvert> {
    return await this.productAdvertRepository.updateByProductId(
      productId,
      productAdvertDto,
    );
  }

  async generateDescription(
    product: ReadProductDto,
    generateDescription: boolean,
  ): Promise<string> {
    if (!generateDescription) {
      return product.ProductAdvert?.description || '';
    }

    if (!product.ProductAdvert) {
      throw new NotFoundException(
        `ProductAdvert not found for product with id: ${product.id}`,
      );
    }

    const generatedDescription =
      this.descriptionGeneratorService.generateDescription(product);

    await this.productAdvertRepository.update(product.ProductAdvert.id, {
      description: generatedDescription,
      isDescriptionGenerated: true,
    });

    return generatedDescription;
  }
}
