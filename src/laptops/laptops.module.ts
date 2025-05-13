import { Module } from '@nestjs/common';
import { LaptopsService } from './laptops.service';

@Module({
  providers: [LaptopsService],
})
export class LaptopsModule {}
