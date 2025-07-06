import { Module } from '@nestjs/common';
import { LaptopsService } from './laptops.service';
import { LaptopsRepository } from './laptop.repository';
import { PrismaService } from '../../../../prisma.service';

@Module({
  providers: [LaptopsService, PrismaService, LaptopsRepository],
  exports: [LaptopsService],
})
export class LaptopsModule {}
