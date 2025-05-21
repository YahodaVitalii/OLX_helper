import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { CreateImageDto } from './dto/create-images.dto';

@Injectable()
export class ProductImagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(productId: number, images: CreateImageDto[]): Promise<Image[]> {
    return this.prisma.$transaction(
      images.map((image) =>
        this.prisma.image.create({
          data: {
            url: image.url,
            product: {
              connect: { id: productId },
            },
          },
        }),
      ),
    );
  }
}
