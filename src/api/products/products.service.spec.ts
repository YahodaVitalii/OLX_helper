import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { ProductRepository } from './products.repository';
import { ProductAdvertService } from './adverts/product-adverts.service';
import { ProductFinancesService } from './finances/product-finances.service';
import { ProductDetailsService } from './details/product-details.service';
import { ProductImagesService } from './images/product-images.service';
import { ProductServiceFactory } from './product.factory';
import { ProductStatus, ProductType } from '@prisma/client';
import { CreateProductDto } from './product-dto/create-product.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './product-dto/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;

  const mockRepository = {
    create: jest.fn(),
    findOneById: jest.fn(),
    findAllByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockAdvertService = {
    createProductAdvert: jest.fn(),
    updateProductAdvertByProductId: jest.fn(),
    generateDescription: jest.fn(),
  };

  const mockFinanceService = {
    create: jest.fn(),
    updateProductFinanceByProductId: jest.fn(),
  };

  const mockDetailsService = {
    createProductDetails: jest.fn(),
    updateProductDetailsByProductId: jest.fn(),
  };

  const mockImagesService = {
    deleteImagesByProductId: jest.fn(),
  };

  const mockHandler = {
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockFactory = {
    getHandler: jest.fn().mockReturnValue(mockHandler),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: mockRepository },
        { provide: ProductAdvertService, useValue: mockAdvertService },
        { provide: ProductFinancesService, useValue: mockFinanceService },
        { provide: ProductDetailsService, useValue: mockDetailsService },
        { provide: ProductImagesService, useValue: mockImagesService },
        { provide: ProductServiceFactory, useValue: mockFactory },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 1, name: 'Test Product' };
      mockRepository.findOneById.mockResolvedValue(product);

      const result = await service.findOne(1);
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOneById.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create Laptop with relations and generate description', async () => {
      const dto: CreateProductDto = {
        name: 'Laptop',
        type: ProductType.LAPTOP,
        ProductAdvert: { title: 'test', description: 'desc' },
        ProductDetails: { features: 'features' },
        ProductFinance: {
          purchasePrice: new Decimal(100),
          sellingPrice: new Decimal(200),
        },
        categoryId: 1,
        status: 'ACTIVE',
      };
      const createdProduct = { id: 1, ...dto };

      mockRepository.create.mockResolvedValue(createdProduct);
      mockRepository.findOneById.mockResolvedValue({
        ...createdProduct,
        ProductAdvert: {},
      });
      mockAdvertService.generateDescription.mockResolvedValue('Generated desc');

      const result = await service.create(dto, true);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Laptop' }),
      );
      expect(mockAdvertService.createProductAdvert).toHaveBeenCalled();
      expect(mockDetailsService.createProductDetails).toHaveBeenCalled();
      expect(mockFinanceService.create).toHaveBeenCalled();
      expect(mockFactory.getHandler).toHaveBeenCalledWith(ProductType.LAPTOP);
      expect(mockHandler.create).toHaveBeenCalled();
      expect(result.ProductAdvert?.description).toEqual('Generated desc');
    });

    it('should create Other product type with handler but skip laptop-specific logic', async () => {
      const dto: CreateProductDto = {
        name: 'Phone',
        type: ProductType.OTHER,
        ProductAdvert: { title: 'test', description: 'desc' },
        categoryId: 1,
        status: 'ACTIVE',
      };
      const createdProduct = { id: 2, ...dto };

      mockRepository.create.mockResolvedValue(createdProduct);
      mockRepository.findOneById.mockResolvedValue({
        ...createdProduct,
        ProductAdvert: {},
      });
      mockAdvertService.generateDescription.mockResolvedValue(
        'Generated desc for other',
      );

      const result = await service.create(dto, true);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Phone' }),
      );
      expect(mockAdvertService.createProductAdvert).toHaveBeenCalled();
      // details and finance may or may not be called depending on your service logic:
      expect(mockDetailsService.createProductDetails).not.toHaveBeenCalled();
      expect(mockFinanceService.create).not.toHaveBeenCalled();
      expect(mockFactory.getHandler).not.toHaveBeenCalled();
      expect(mockHandler.create).not.toHaveBeenCalled();
      expect(result.ProductAdvert?.description).toEqual(
        'Generated desc for other',
      );
    });
  });
  describe('update', () => {
    it('should update product and relations', async () => {
      const dto: UpdateProductDto = {
        name: 'Updated',
        type: ProductType.LAPTOP,
        ProductAdvert: { title: 'test', description: 'desc' },
        categoryId: 1,
        status: 'ACTIVE',
      };

      mockRepository.findOneById.mockResolvedValue({
        id: 1,
        ...dto,
        ProductAdvert: {},
      });
      mockAdvertService.generateDescription.mockResolvedValue('Updated desc');

      const result = await service.update(1, dto, true);

      expect(mockRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ name: 'Updated' }),
      );
      expect(
        mockAdvertService.updateProductAdvertByProductId,
      ).toHaveBeenCalled();
      expect(mockFactory.getHandler).toHaveBeenCalledWith(ProductType.LAPTOP);
      expect(mockHandler.update).toHaveBeenCalled();
      expect(result.ProductAdvert?.description).toEqual('Updated desc');
    });
  });

  describe('delete', () => {
    it('should delete images and product', async () => {
      mockRepository.delete.mockResolvedValue({ success: true });

      const result = await service.delete(1, true);

      expect(mockImagesService.deleteImagesByProductId).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateStatus', () => {
    it('should update product status', async () => {
      mockRepository.updateStatus.mockResolvedValue({
        id: 1,
        status: ProductStatus.SOLD,
      });

      const result = await service.updateStatus(1, ProductStatus.SOLD);
      expect(mockRepository.updateStatus).toHaveBeenCalledWith(
        1,
        ProductStatus.SOLD,
      );
      expect(result.status).toEqual(ProductStatus.SOLD);
    });
  });
});
