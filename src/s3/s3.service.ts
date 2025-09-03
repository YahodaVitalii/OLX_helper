import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  readonly region: string;
  private s3: S3Client;
  readonly bucket: string;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY');

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS S3 credentials in environment variables');
    }

    this.region = configService.get<string>('S3_REGION') || 'eu-north-1';
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    const bucket = this.configService.get<string>('S3_BUCKET');
    if (!bucket) {
      throw new Error('S3_BUCKET is not defined in config!');
    }
    this.bucket = bucket;
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Invalid file uploaded');
    }

    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: this.bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );

      if (response.$metadata.httpStatusCode === 200) {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }

      throw new ServiceUnavailableException('Failed to upload file to S3');
    } catch (err) {
      throw new ServiceUnavailableException(
        `Cannot save file to S3: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
  async deleteFile(urlOrKey: string) {
    const key = urlOrKey.replace(/^https?:\/\/[^/]+\//, '');

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async deleteFolder(prefix: string) {
    let continuationToken: string | undefined;

    do {
      const listResponse = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      if (!listResponse.Contents?.length) break;

      await this.s3.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: {
            Objects: listResponse.Contents.map((obj) => ({ Key: obj.Key! })),
          },
        }),
      );

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);
  }
}
