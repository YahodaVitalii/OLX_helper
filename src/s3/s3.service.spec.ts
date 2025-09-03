import { ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';
import * as S3SDK from '@aws-sdk/client-s3';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

jest.mock('@aws-sdk/client-s3', () => {
  const actual: typeof S3SDK = jest.requireActual('@aws-sdk/client-s3');
  return {
    ...actual,
    S3Client: jest.fn(),
  };
});

describe('S3Service', () => {
  let service: S3Service;
  let configService: jest.Mocked<ConfigService>;
  let sendMock: jest.Mock;

  beforeEach(() => {
    sendMock = jest.fn();
    (S3Client as jest.Mock).mockImplementation(() => ({
      send: sendMock,
    }));

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    configService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'S3_ACCESS_KEY':
          return 'test-access';
        case 'S3_SECRET_KEY':
          return 'test-secret';
        case 'S3_REGION':
          return 'eu-north-1';
        case 'S3_BUCKET':
          return 'test-bucket';
        default:
          return undefined;
      }
    });

    service = new S3Service(configService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if access key or secret key is missing', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'S3_BUCKET') return 'test-bucket';
        return undefined;
      });

      expect(() => new S3Service(configService)).toThrow(
        'Missing AWS S3 credentials in environment variables',
      );
    });

    it('should throw error if bucket is missing', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'S3_ACCESS_KEY') return 'test-access';
        if (key === 'S3_SECRET_KEY') return 'test-secret';
        return undefined;
      });

      expect(() => new S3Service(configService)).toThrow(
        'S3_BUCKET is not defined in config!',
      );
    });
  });

  describe('uploadFile', () => {
    it('should upload file and return public URL', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      sendMock.mockResolvedValueOnce({
        $metadata: { httpStatusCode: 200 },
      });

      const result = await service.uploadFile(mockFile, 'folder/test.png');

      expect(sendMock).toHaveBeenCalledWith(expect.any(PutObjectCommand));
      expect(result).toBe(
        'https://test-bucket.s3.eu-north-1.amazonaws.com/folder/test.png',
      );
    });

    it('should throw error if upload fails with non-200 code', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      sendMock.mockResolvedValueOnce({
        $metadata: { httpStatusCode: 500 },
      });

      await expect(
        service.uploadFile(mockFile, 'folder/test.png'),
      ).rejects.toThrow('Image not saved in s3!');
    });

    it('should throw error if S3 send rejects', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'image/png',
      } as Express.Multer.File;

      sendMock.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        service.uploadFile(mockFile, 'folder/test.png'),
      ).rejects.toThrow('Network error');
    });
  });

  describe('deleteFile', () => {
    it('should delete file by extracting key from URL', async () => {
      sendMock.mockResolvedValueOnce({});

      await service.deleteFile(
        'https://test-bucket.s3.eu-north-1.amazonaws.com/folder/test.png',
      );

      expect(sendMock).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));

      const firstCall = sendMock.mock.calls[0] as [DeleteObjectCommand];
      const commandPassed = firstCall[0];

      expect(commandPassed.input).toEqual({
        Bucket: 'test-bucket',
        Key: 'folder/test.png',
      });
    });

    it('should delete file when only key is provided', async () => {
      sendMock.mockResolvedValueOnce({});

      await service.deleteFile('folder/test.png');

      expect(sendMock).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const commandInstance = sendMock.mock.calls[0][0] as DeleteObjectCommand;
      expect(commandInstance.input).toEqual({
        Bucket: 'test-bucket',
        Key: 'folder/test.png',
      });
    });
  });

  describe('deleteFolder', () => {
    it('should delete all files in folder (single batch)', async () => {
      sendMock
        .mockResolvedValueOnce({
          Contents: [{ Key: 'folder/file1.png' }, { Key: 'folder/file2.png' }],
          NextContinuationToken: undefined,
        })
        .mockResolvedValueOnce({}); // For DeleteObjectsCommand

      await service.deleteFolder('folder/');

      expect(sendMock).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
      expect(sendMock).toHaveBeenCalledWith(expect.any(DeleteObjectsCommand));
    });

    it('should not call delete if folder is empty', async () => {
      sendMock.mockResolvedValueOnce({
        Contents: [],
        NextContinuationToken: undefined,
      });

      await service.deleteFolder('empty-folder/');

      expect(sendMock).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple pages of results', async () => {
      sendMock
        .mockResolvedValueOnce({
          Contents: [{ Key: 'folder/file1.png' }],
          NextContinuationToken: 'token-1',
        })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({
          Contents: [{ Key: 'folder/file2.png' }],
          NextContinuationToken: undefined,
        })
        .mockResolvedValueOnce({});

      await service.deleteFolder('folder/');

      expect(sendMock).toHaveBeenCalledWith(expect.any(ListObjectsV2Command));
      expect(sendMock).toHaveBeenCalledWith(expect.any(DeleteObjectsCommand));
    });
  });
});
