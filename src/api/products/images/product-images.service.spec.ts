import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductImagesService } from './product-images.service';
import { ProductImagesRepository } from './product-images.repository';
import { S3Service } from '../../../s3/s3.service';

describe('ProductImagesService', () => {
  let service: ProductImagesService;
  let repo: jest.Mocked<ProductImagesRepository>;
  let s3: jest.Mocked<S3Service>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductImagesService,
        {
          provide: ProductImagesRepository,
          useValue: {
            createMany: jest.fn(),
            countByProductId: jest.fn(),
            findById: jest.fn(),
            updateUrlAndOrder: jest.fn(),
            findByProduct: jest.fn(),
            updateOrdersTwoPhase: jest.fn(),
            findByIdsOrdered: jest.fn(),
            countManyByProduct: jest.fn(),
            deleteByProductId: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
            deleteFolder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProductImagesService);
    repo = module.get(ProductImagesRepository);
    s3 = module.get(S3Service);
  });

  describe('saveImages', () => {
    it('should save uploaded images', async () => {
      const files = [
        { originalname: 'img1.png' },
        { originalname: 'img2.png' },
      ] as Express.Multer.File[];

      jest.spyOn(repo, 'countByProductId').mockResolvedValue(0);
      jest
        .spyOn(s3, 'uploadFile')
        .mockResolvedValueOnce('url1')
        .mockResolvedValueOnce('url2');

      const mockSavedImages = [
        {
          id: 1,
          productId: 1,
          url: 'url1',
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          productId: 1,
          url: 'url2',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repo, 'createMany').mockResolvedValue(mockSavedImages);

      const result = await service.saveImages(1, files);

      const countSpy = jest.spyOn(repo, 'countByProductId');
      const uploadSpy = jest.spyOn(s3, 'uploadFile');
      const createManySpy = jest.spyOn(repo, 'createMany');

      expect(countSpy).toHaveBeenCalledWith(1);
      expect(uploadSpy).toHaveBeenCalledTimes(2);
      expect(createManySpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ productId: 1, url: 'url1', order: 0 }),
          expect.objectContaining({ productId: 1, url: 'url2', order: 1 }),
        ]),
      );
      const expected = [
        { productId: 1, url: 'url1', order: 0 },
        { productId: 1, url: 'url2', order: 1 },
      ];
      expect(result).toHaveLength(2);
      expect(result).toEqual(expected);
    });

    it('should throw if no files uploaded', async () => {
      await expect(service.saveImages(1, [])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if product exceeds 8 images', async () => {
      repo.countByProductId.mockResolvedValue(8);
      const files = [{ originalname: 'img.png' }] as Express.Multer.File[];

      await expect(service.saveImages(1, files)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('replaceImages', () => {
    it('should replace images with new files', async () => {
      const files = [{ originalname: 'new.png' }] as Express.Multer.File[];
      const targetIds = [1];

      const mockImage = {
        id: 1,
        productId: 1,
        url: 'old.png',
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repo.findById.mockResolvedValue(mockImage);
      s3.uploadFile.mockResolvedValue('new-url');
      repo.updateUrlAndOrder.mockResolvedValue({
        ...mockImage,
        url: 'new-url',
        updatedAt: new Date(),
      });

      const result = await service.replaceImages(targetIds, files);

      const findByIdSpy = jest.spyOn(repo, 'findById');
      const uploadSpy = jest.spyOn(s3, 'uploadFile');
      const deleteSpy = jest.spyOn(s3, 'deleteFile');
      const updateSpy = jest.spyOn(repo, 'updateUrlAndOrder');

      expect(findByIdSpy).toHaveBeenCalledWith(1);
      expect(uploadSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalledWith('old.png');
      expect(updateSpy).toHaveBeenCalledWith(1, 'new-url', 0);
      expect(result[0].url).toBe('new-url');
    });

    it('should throw if counts mismatch', async () => {
      await expect(
        service.replaceImages([1], [] as Express.Multer.File[]),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if image not found', async () => {
      repo.findById.mockResolvedValue(null);
      const files = [{ originalname: 'a.png' }] as Express.Multer.File[];
      await expect(service.replaceImages([1], files)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changeOrder', () => {
    it('should update image orders', async () => {
      const orderMap = { 1: 2, 2: 1 };
      const allImages = [
        { id: 1, order: 0, productId: 1 },
        { id: 2, order: 1, productId: 1 },
      ];

      repo.findByProduct.mockResolvedValue(allImages);
      repo.updateOrdersTwoPhase.mockResolvedValue(undefined);
      repo.findByIdsOrdered.mockResolvedValue([
        {
          id: 1,
          url: 'u',
          order: 2,
          productId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          url: 'u',
          order: 1,
          productId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.changeOrder(1, orderMap);

      expect(repo.updateOrdersTwoPhase).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should throw if order conflicts with others', async () => {
      const orderMap = { 1: 1 };
      const allImages = [
        { id: 1, order: 0, productId: 1 },
        { id: 2, order: 1, productId: 1 },
      ];

      repo.findByProduct.mockResolvedValue(allImages);

      await expect(service.changeOrder(1, orderMap)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('checkOwnership', () => {
    it('should return true if all ids belong to product', async () => {
      repo.countManyByProduct.mockResolvedValue(2);
      const result = await service.checkOwnership([1, 2], 1);
      expect(result).toBe(true);
    });

    it('should return false if ids mismatch', async () => {
      repo.countManyByProduct.mockResolvedValue(1);
      const result = await service.checkOwnership([1, 2], 1);
      expect(result).toBe(false);
    });
  });

  describe('deleteImagesByProductId', () => {
    it('should delete folder and db records', async () => {
      await service.deleteImagesByProductId(1);
      expect(s3.deleteFolder).toHaveBeenCalled();
      expect(repo.deleteByProductId).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteImage', () => {
    it('should delete image by id', async () => {
      const mockImage = {
        id: 1,
        url: 'file.png',
        productId: 1,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repo.findById.mockResolvedValue(mockImage);
      repo.deleteById.mockResolvedValue({ message: 'deleted' } as {
        message: string;
      });

      const result = await service.deleteImage(1);

      expect(s3.deleteFile).toHaveBeenCalledWith('file.png');
      expect(repo.deleteById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'deleted' });
    });

    it('should throw if image not found', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.deleteImage(1)).rejects.toThrow(BadRequestException);
    });
  });
});
