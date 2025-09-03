import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DescriptionGeneratorService } from './description-generator.service';
import { ProductService } from '../api/products/products.service';
import { ProductType } from '@prisma/client';
import { DESCRIPTION_TEXTS } from './constants/description-texts';
import { ReadProductDto } from '../api/products/product-dto/read-product.dto';

describe('DescriptionGeneratorService', () => {
  let service: DescriptionGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DescriptionGeneratorService,
        {
          provide: ProductService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DescriptionGeneratorService>(
      DescriptionGeneratorService,
    );
  });

  describe('generateDescription', () => {
    it('should throw error if product details missing', () => {
      const product = { type: ProductType.LAPTOP } as ReadProductDto;
      expect(() => service.generateDescription(product)).toThrow(
        'Product details not found',
      );
    });

    it('should generate laptop description correctly', () => {
      const product = {
        type: ProductType.LAPTOP,
        Laptop: {
          brand: 'Dell',
          subBrand: 'Inspiron',
          model: '5000',
          processor: 'Intel',
          processorModel: 'i7',
          ramSize: '16GB',
          hardDrive: '512GB SSD',
          graphicCard: 'NVIDIA GTX 1650',
          screenSize: '15.6"',
          screenRefreshRate: 144,
          batteryStatus: 'Working',
          batteryWear: '80%',
        },
        ProductDetails: {},
      } as ReadProductDto;

      const description = service.generateDescription(product);
      expect(description).toContain(DESCRIPTION_TEXTS.greeting);
      expect(description).toContain('Intel i7'); // processor
      expect(description).toContain('16GB'); // RAM
      expect(description).toContain('512GB SSD'); // storage
      expect(description).toContain('NVIDIA GTX 1650'); // GPU
      expect(description).toContain('15.6" (144 Гц)'); // screen
      expect(description).toContain('80%'); // battery wear
    });

    it('should throw BadRequestException for OTHER type if characteristics missing', () => {
      const product = {
        type: ProductType.OTHER,
        ProductDetails: {},
        ProductAdvert: null,
      } as ReadProductDto;

      expect(() => service.generateDescription(product)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for unsupported product type', () => {
      const product = {
        type: 'UNSUPPORTED_TYPE',
        ProductDetails: {},
      } as unknown as ReadProductDto;

      expect(() => service.generateDescription(product)).toThrow(
        BadRequestException,
      );
    });

    it('should include accessories, features, and disadvantages if present', () => {
      const product = {
        type: ProductType.LAPTOP,
        Laptop: {
          brand: 'HP',
          subBrand: 'Pavilion',
          model: '15',
        },
        ProductDetails: {
          includedAccessories: 'Charger, Bag',
          features: 'Lightweight, Fast',
          disadvantages: 'Battery life short',
        },
      } as ReadProductDto;

      const description = service.generateDescription(product);
      expect(description).toContain('Charger, Bag');
      expect(description).toContain('Lightweight, Fast');
      expect(description).toContain('Battery life short');
    });
  });
});
