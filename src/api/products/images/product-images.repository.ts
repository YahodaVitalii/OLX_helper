import { Injectable, NotFoundException } from '@nestjs/common';
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
  async countByProductId(productId: number): Promise<number> {
    return this.prisma.image.count({
      where: { productId },
    });
  }
  async updateUrlAndOrder(
    id: number,
    url: string,
    order: number,
  ): Promise<Image> {
    return this.prisma.image.update({
      where: { id },
      data: { url, order },
    });
  }

  async findByProduct(productId: number) {
    return this.prisma.image.findMany({
      where: { productId },
      select: { id: true, order: true, productId: true },
    });
  }

  async updateOrdersTwoPhase(
    entries: [number, number][],
    allImages: { id: number; order: number }[],
  ) {
    const currentMax = allImages.reduce((m, i) => Math.max(m, i.order ?? 0), 0);
    const tempBase = currentMax + 1000;

    const phaseA = entries.map(([id], idx) =>
      this.prisma.image.update({
        where: { id },
        data: { order: tempBase + idx + 1 },
      }),
    );

    const phaseB = entries.map(([id, finalOrder]) =>
      this.prisma.image.update({
        where: { id },
        data: { order: finalOrder },
      }),
    );

    await this.prisma.$transaction([...phaseA, ...phaseB]);
  }

  async findByIdsOrdered(ids: number[]) {
    return this.prisma.image.findMany({
      where: { id: { in: ids } },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: number): Promise<Image | null> {
    const image = await this.prisma.image.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async countManyByProduct(
    imageIds: number[],
    productId: number,
  ): Promise<number> {
    return this.prisma.image.count({
      where: {
        id: { in: imageIds },
        productId,
      },
    });
  }

  async deleteByProductId(productId: number): Promise<number> {
    const result = await this.prisma.image.deleteMany({
      where: { productId },
    });
    return result.count;
  }

  async deleteById(id: number): Promise<{ message: string }> {
    await this.prisma.image.delete({ where: { id } });
    return { message: `Image ${id} deleted successfully` };
  }
}
