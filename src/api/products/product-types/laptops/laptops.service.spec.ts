import { Test, TestingModule } from '@nestjs/testing';
import { LaptopsService } from './laptops.service';
import { LaptopsRepository } from './laptop.repository';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';
import { Laptop, ProductStatus, ProductType } from '@prisma/client';

describe('LaptopsService', () => {
  let service: LaptopsService;
  let repository: jest.Mocked<LaptopsRepository>;

  const mockLaptop: Laptop = {
    id: 1,
    productId: 10,
    brand: 'Dell',
    subBrand: 'Inspiron',
    model: 'e3000',
    screenExpansion: 'Full HD',
    screenSize: 15.6,
    screenRefreshRate: 60,
    batteryStatus: 'Working',
    batteryWear: 10,
    processor: 'Intel',
    processorModel: 'Core i7-1165G7',
    ramSize: 16,
    graphicCard: 'NVIDIA GeForce GTX 1650',
    chargerCompletion: true,
    hardDrive: '512GB SSD',
    isGamer: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LaptopsService,
        {
          provide: LaptopsRepository,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LaptopsService>(LaptopsService);
    repository = module.get(LaptopsRepository);
  });

  describe('create', () => {
    it('should call repository.create with correct arguments and return laptop', async () => {
      const createLaptopDto: CreateLaptopDto = {
        brand: 'Dell',
        subBrand: 'Inspiron',
        model: 'e3000',
        screenExpansion: 'Full HD',
        screenSize: 15.6,
        screenRefreshRate: 60,
        batteryStatus: 'Working',
        batteryWear: 10,
        processor: 'Intel',
        processorModel: 'Core i7-1165G7',
        ramSize: 16,
        graphicCard: 'NVIDIA GeForce GTX 1650',
        chargerCompletion: true,
        hardDrive: '512GB SSD',
        isGamer: false,
      };

      const createProductDto = {
        name: 'Laptop Dell Inspiron 15',
        categoryId: 1,
        status: ProductStatus.ACTIVE,
        type: ProductType.LAPTOP,
        Laptop: createLaptopDto,
      };

      repository.create.mockResolvedValue(mockLaptop);

      const result = await service.create(10, createProductDto);

      expect(repository.create).toHaveBeenCalledWith(10, createLaptopDto);
      expect(result).toEqual(mockLaptop);
    });
  });

  describe('findOne', () => {
    it('should call repository.findOne and return a laptop', async () => {
      repository.findOne.mockResolvedValue(mockLaptop);

      const result = await service.findOne(10);

      expect(repository.findOne).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockLaptop);
    });
  });

  describe('update', () => {
    it('should call repository.update with correct arguments and return updated laptop', async () => {
      const updateLaptopDto: UpdateLaptopDto = {
        brand: 'Dell',
        subBrand: 'Inspiron',
        model: 'e3001',
        screenExpansion: 'Full HD',
        screenSize: 15.6,
        screenRefreshRate: 120,
        batteryStatus: 'Working',
        batteryWear: 8,
        processor: 'Intel',
        processorModel: 'Core i7-1165G7',
        ramSize: 32,
        graphicCard: 'NVIDIA GeForce RTX 3060',
        chargerCompletion: true,
        hardDrive: '1TB SSD',
        isGamer: true,
      };

      const updateProductDto = {
        name: 'Laptop Dell Inspiron 15',
        categoryId: 1,
        status: ProductStatus.ACTIVE,
        type: ProductType.LAPTOP,
        Laptop: updateLaptopDto as Required<UpdateLaptopDto>,
      };

      const updatedLaptop = { ...mockLaptop, ...updateLaptopDto };
      repository.update.mockResolvedValue(updatedLaptop);

      const result = await service.update(10, updateProductDto);

      expect(repository.update).toHaveBeenCalledWith(10, updateLaptopDto);
      expect(result).toEqual(updatedLaptop);
    });
  });
});
