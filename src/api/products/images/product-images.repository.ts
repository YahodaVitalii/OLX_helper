import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';

@Injectable()
export class ProductImagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    images: { productId: number; url: string; order: number }[],
  ): Promise<Image[]> {
    return Promise.all(
      images.map((img) =>
        this.prisma.image.create({
          data: img,
        }),
      ),
    );
  }
}
