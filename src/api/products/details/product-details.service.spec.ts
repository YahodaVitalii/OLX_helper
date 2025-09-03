import { Test, TestingModule } from '@nestjs/testing';
import { ProductDetailsService } from './product-details.service';
import { ProductDetailsRepository } from './product-details.repository';
import { ProductDetailsDto } from './dto/product-details.dto';
import { ReadProductDetailsDto } from './dto/read-product-details.dto';

describe('ProductDetailsService', () => {
  let service: ProductDetailsService;
  let repo: jest.Mocked<ProductDetailsRepository>;

  const mockProductDetails: ReadProductDetailsDto = {
    id: 1,
    productId: 10,
    characteristics: 'Fast CPU, 16GB RAM',
    features: 'Touchscreen, Backlit keyboard',
    disadvantages: 'Heavy',
    includedAccessories: 'Charger, Bag',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductDetailsService,
        {
          provide: ProductDetailsRepository,
          useValue: {
            create: jest.fn(),
            updateByProductId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductDetailsService>(ProductDetailsService);
    repo = module.get(ProductDetailsRepository);
  });

  describe('createProductDetails', () => {
    it('should call repository.create and return created product details', async () => {
      const dto: ProductDetailsDto = {
        characteristics: 'Fast CPU, 16GB RAM',
        features: 'Touchscreen, Backlit keyboard',
        disadvantages: 'Heavy',
        includedAccessories: 'Charger, Bag',
      };

      const createSpy = jest
        .spyOn(repo, 'create')
        .mockResolvedValue(mockProductDetails);

      const result = await service.createProductDetails(10, dto);

      expect(createSpy).toHaveBeenCalledWith(10, dto);
      expect(result).toEqual(mockProductDetails);
    });
  });

  describe('updateProductDetailsByProductId', () => {
    it('should call repository.updateByProductId and return updated product details', async () => {
      const dto: ProductDetailsDto = {
        characteristics: 'Updated specs',
        features: 'Updated features',
        disadvantages: 'Still heavy',
        includedAccessories: 'Updated accessories',
      };

      const updated = { ...mockProductDetails, ...dto };
      const updateSpy = jest
        .spyOn(repo, 'updateByProductId')
        .mockResolvedValue(updated);

      const result = await service.updateProductDetailsByProductId(10, dto);

      expect(updateSpy).toHaveBeenCalledWith(10, dto);
      expect(result).toEqual(updated);
    });
  });
});
