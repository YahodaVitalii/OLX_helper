import { Test, TestingModule } from '@nestjs/testing';
import { ProductFinancesService } from './product-finances.service';
import { ProductFinancesRepository } from './product-finances.repository';
import { CreateProductFinanceDto } from './dto/create-product-finance.dto';
import { UpdateProductFinanceDto } from './dto/update-product-finance.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('ProductFinancesService', () => {
  let service: ProductFinancesService;
  let repo: jest.Mocked<ProductFinancesRepository>;

  const mockProductFinance = {
    id: 1,
    productId: 10,
    purchasePrice: new Decimal(100),
    sellingPrice: new Decimal(200),
    additionalCosts: new Decimal(50),
    profit: new Decimal(50),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductFinancesService,
        {
          provide: ProductFinancesRepository,
          useValue: {
            create: jest.fn(),
            updateByProductId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductFinancesService>(ProductFinancesService);
    repo = module.get(ProductFinancesRepository);
  });

  describe('create', () => {
    it('should create a product finance with calculated profit', async () => {
      const dto: CreateProductFinanceDto = {
        purchasePrice: new Decimal(100),
        sellingPrice: new Decimal(200),
        additionalCosts: new Decimal(50),
      };

      const spyCreate = jest
        .spyOn(repo, 'create')
        .mockResolvedValue(mockProductFinance);

      const result = await service.create(10, dto);

      expect(spyCreate).toHaveBeenCalledWith(10, {
        ...dto,
        profit: new Decimal(50), // 200 - (100 + 50)
      });
      expect(result).toEqual(mockProductFinance);
    });
  });

  describe('updateProductFinanceByProductId', () => {
    it('should call repository.updateByProductId with correct parameters', async () => {
      const dto: UpdateProductFinanceDto = {
        purchasePrice: new Decimal(150),
        sellingPrice: new Decimal(250),
        additionalCosts: new Decimal(30),
      };

      const spyUpdate = jest
        .spyOn(repo, 'updateByProductId')
        .mockResolvedValue(mockProductFinance);

      await service.updateProductFinanceByProductId(10, dto);

      expect(spyUpdate).toHaveBeenCalledWith(10, dto);
    });
  });

  describe('calculateProfit', () => {
    it('should correctly calculate profit', () => {
      const profit = service['calculateProfit'](
        new Decimal(100),
        new Decimal(200),
        new Decimal(50),
      );

      expect(profit.toNumber()).toBe(50);
    });
  });
});
