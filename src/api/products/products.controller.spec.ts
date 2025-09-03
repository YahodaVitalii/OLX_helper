import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { ProductStatus } from '@prisma/client';
import { CreateProductDto } from './product-dto/create-product.dto';
import { RequestUserContext } from '../../types/Express/req-user-context.interface';
import { UpdateProductDto } from './product-dto/update-product.dto';
import { ProductRepository } from './products.repository';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductService, useValue: mockService },
        {
          provide: ProductRepository,
          useValue: {
            findOneById: jest.fn(),
            findAllByUserId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductService>(ProductService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with userId and dto', async () => {
      const dto = { name: 'New Product' };
      const req = { user: { userId: 1 } };
      mockService.create.mockResolvedValue({ id: 1, ...dto });

      const spyCreate = jest.spyOn(service, 'create');

      const result = await controller.create(
        dto as CreateProductDto,
        req as RequestUserContext,
        true,
      );

      expect(spyCreate).toHaveBeenCalledWith({ ...dto, userId: 1 }, true);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return all products for a user', async () => {
      const req = { user: { userId: 1 } };
      mockService.findAll.mockResolvedValue([{ id: 1 }]);

      const spyFindAll = jest.spyOn(service, 'findAll');

      const result = await controller.findAll(req as RequestUserContext);
      expect(spyFindAll).toHaveBeenCalledWith(1);
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('findOne', () => {
    it('should return product by id', async () => {
      mockService.findOne.mockResolvedValue({ id: 1 });

      const spyFindOne = jest.spyOn(service, 'findOne');

      const result = await controller.findOne('1');
      expect(spyFindOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      const dto = { name: 'Updated' };
      mockService.update.mockResolvedValue({ id: 1, ...dto });

      const spyUpdate = jest.spyOn(service, 'update');

      const result = await controller.update(
        '1',
        dto as UpdateProductDto,
        true,
      );
      expect(spyUpdate).toHaveBeenCalledWith(1, dto, true);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('updateStatus', () => {
    it('should update product status', async () => {
      const dto = { status: ProductStatus.SOLD };
      mockService.updateStatus.mockResolvedValue({
        id: 1,
        status: ProductStatus.SOLD,
      });

      const spyUpdateStatus = jest.spyOn(service, 'updateStatus');

      const result = await controller.updateStatus('1', dto);
      expect(spyUpdateStatus).toHaveBeenCalledWith(1, ProductStatus.SOLD);
      expect(result.status).toEqual(ProductStatus.SOLD);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockService.delete.mockResolvedValue({ success: true });

      const spyDelete = jest.spyOn(service, 'delete');

      const result = await controller.remove('1', true);
      expect(spyDelete).toHaveBeenCalledWith(1, true);
      expect(result).toEqual({ success: true });
    });
  });
});
