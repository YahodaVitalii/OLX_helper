import { Module } from '@nestjs/common';
import { DescriptionGeneratorService } from './description-generator.service';

@Module({
  providers: [DescriptionGeneratorService],
  exports: [DescriptionGeneratorService],
})
export class DescriptionGeneratorModule {}
