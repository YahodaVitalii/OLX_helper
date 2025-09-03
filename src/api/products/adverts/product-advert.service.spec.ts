import { Test, TestingModule } from '@nestjs/testing';
import { ProductAdvertService } from './product-adverts.service';
import { ProductAdvertRepository } from './product-adverts.repository';
import { DescriptionGeneratorService } from '../../../description-generator/description-generator.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProductAdvertDto } from './dto/create-product-advert.dto';
import { UpdateProductAdvertDto } from './dto/update-product-advert.dto';
import { ReadProductDto } from '../product-dto/read-product.dto';
import { ProductStatus, ProductType } from '@prisma/client';

describe('ProductAdvertService', () => {
  let service: ProductAdvertService;
  let repo: jest.Mocked<ProductAdvertRepository>;
  let generator: jest.Mocked<DescriptionGeneratorService>;

  const mockProductAdvert = {
    id: 1,
    productId: 10,
    olxId: null,
    title: 'Laptop advert',
    description: 'Great laptop',
    isDescriptionGenerated: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductAdvertService,
        {
          provide: ProductAdvertRepository,
          useValue: {
            create: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            updateByProductId: jest.fn(),
          },
        },
        {
          provide: DescriptionGeneratorService,
          useValue: {
            generateDescription: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductAdvertService>(ProductAdvertService);
    repo = module.get(ProductAdvertRepository);
    generator = module.get(DescriptionGeneratorService);
  });

  it('should create a product advert', async () => {
    const dto: CreateProductAdvertDto = { title: 'Test', description: 'desc' };

    const spy = jest.spyOn(repo, 'create').mockResolvedValue(mockProductAdvert);

    const result = await service.createProductAdvert(10, dto);

    expect(spy).toHaveBeenCalledWith(10, dto);
    expect(result).toEqual(mockProductAdvert);
  });

  it('should find a product advert by id', async () => {
    const spy = jest
      .spyOn(repo, 'findOneById')
      .mockResolvedValue(mockProductAdvert);

    const result = await service.findOne(1);

    expect(spy).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockProductAdvert);
  });

  it('should throw NotFoundException if product advert not found', async () => {
    repo.findOneById.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('should update a product advert', async () => {
    const dto: UpdateProductAdvertDto = { title: 'Updated' };
    const updated = { ...mockProductAdvert, ...dto };

    const spy = jest.spyOn(repo, 'update').mockResolvedValue(updated);

    const result = await service.updateProductAdvert(1, dto);

    expect(spy).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(updated);
  });

  it('should update a product advert by productId', async () => {
    const dto: UpdateProductAdvertDto = { description: 'new desc' };
    const updated = { ...mockProductAdvert, ...dto };

    const spy = jest
      .spyOn(repo, 'updateByProductId')
      .mockResolvedValue(updated);

    const result = await service.updateProductAdvertByProductId(10, dto);

    expect(spy).toHaveBeenCalledWith(10, dto);
    expect(result).toEqual(updated);
  });

  describe('generateDescription', () => {
    it('should return existing description if generateDescription=false', async () => {
      const product: ReadProductDto = {
        id: 1,
        name: 'Laptop',
        type: ProductType.LAPTOP,
        categoryId: 123,
        status: ProductStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        ProductAdvert: { ...mockProductAdvert },
      };

      const result = await service.generateDescription(product, false);

      expect(result).toEqual('Great laptop');
      expect(
        jest.spyOn(generator, 'generateDescription'),
      ).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if no ProductAdvert exists', async () => {
      const product: ReadProductDto = {
        id: 1,
        name: 'Laptop',
        type: ProductType.LAPTOP,
        categoryId: 123,
        status: ProductStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        ProductAdvert: null,
      };

      await expect(service.generateDescription(product, true)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should generate and update description if generateDescription=true', async () => {
      const product: ReadProductDto = {
        id: 1,
        name: 'Laptop',
        type: ProductType.LAPTOP,
        categoryId: 123,
        status: ProductStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
        ProductAdvert: { ...mockProductAdvert },
      };

      const genSpy = jest
        .spyOn(generator, 'generateDescription')
        .mockReturnValue('AI generated desc');

      const updateSpy = jest.spyOn(repo, 'update').mockResolvedValue({
        ...mockProductAdvert,
        description: 'AI generated desc',
        isDescriptionGenerated: true,
      });

      const result = await service.generateDescription(product, true);

      expect(genSpy).toHaveBeenCalledWith(product);
      expect(updateSpy).toHaveBeenCalledWith(mockProductAdvert.id, {
        description: 'AI generated desc',
        isDescriptionGenerated: true,
      });
      expect(result).toEqual('AI generated desc');
    });
  });
});
