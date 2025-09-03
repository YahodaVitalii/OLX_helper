import { Test, TestingModule } from '@nestjs/testing';
import { ProductImagesController } from './product-images.controller';
import { ProductImagesService } from './product-images.service';
import { BadRequestException } from '@nestjs/common';
import { ProductImageDto } from './dto/product-image.dto';

describe('ProductImagesController', () => {
  let controller: ProductImagesController;
  let service: ProductImagesService;

  const mockService = {
    saveImages: jest.fn(),
    deleteImage: jest.fn(),
    replaceImages: jest.fn(),
    changeOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductImagesController],
      providers: [{ provide: ProductImagesService, useValue: mockService }],
    }).compile();

    controller = module.get<ProductImagesController>(ProductImagesController);
    service = module.get<ProductImagesService>(ProductImagesService);

    jest.clearAllMocks();
  });

  describe('uploadProductImages', () => {
    it('should call service.saveImages with productId and files', async () => {
      const files = [{ originalname: 'img1.png' }] as Express.Multer.File[];

      const mockResult: ProductImageDto[] = [
        {
          id: 1,
          productId: 10,
          url: 'image1.png',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          productId: 10,
          url: 'image2.png',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const saveSpy = jest
        .spyOn(service, 'saveImages')
        .mockResolvedValue(mockResult);

      const result = await controller.uploadProductImages(10, files);

      expect(saveSpy).toHaveBeenCalledWith(10, files);
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteImage', () => {
    it('should call service.deleteImage with imageId', async () => {
      const mockResponse: { message: string } = { message: 'deleted' };

      const deleteSpy = jest
        .spyOn(service, 'deleteImage')
        .mockResolvedValue(mockResponse);

      const result = await controller.deleteImage(5);

      expect(deleteSpy).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('replaceImages', () => {
    it('should throw BadRequestException if no files', async () => {
      await expect(
        controller.replaceImages([], JSON.stringify([1, 2])),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if files length !== target IDs length', async () => {
      const files = [{ originalname: 'img1.png' }] as Express.Multer.File[];
      await expect(
        controller.replaceImages(files, JSON.stringify([1, 2])),
      ).rejects.toThrow(BadRequestException);
    });

    it('should call service.replaceImages with IDs and files', async () => {
      const files = [
        { originalname: 'img1.png' },
        { originalname: 'img2.png' },
      ] as Express.Multer.File[];
      const targetIds = [1, 2];

      const mockResponse: ProductImageDto[] = [
        {
          id: 1,
          productId: 10,
          url: 'url1',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          productId: 10,
          url: 'url2',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const spy = jest
        .spyOn(service, 'replaceImages')
        .mockResolvedValue(mockResponse);

      const result = await controller.replaceImages(
        files,
        JSON.stringify(targetIds),
      );

      expect(spy).toHaveBeenCalledWith(targetIds, files);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('changeOrder', () => {
    it('should call service.changeOrder with productId and orderMap', async () => {
      const orderMap = { 1: 2, 2: 1 };

      const mockResponse: ProductImageDto[] = [
        {
          id: 1,
          productId: 10,
          url: 'url1',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          productId: 10,
          url: 'url2',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const spy = jest
        .spyOn(service, 'changeOrder')
        .mockResolvedValue(mockResponse);

      const result = await controller.changeOrder(10, orderMap);

      expect(spy).toHaveBeenCalledWith(10, orderMap);
      expect(result).toEqual(mockResponse);
    });
  });
});
