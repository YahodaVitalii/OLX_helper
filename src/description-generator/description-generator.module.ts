import { forwardRef, Module } from '@nestjs/common';
import { DescriptionGeneratorService } from './description-generator.service';
import { ProductsModule } from '../api/products/products.module';

@Module({
  providers: [DescriptionGeneratorService],
  exports: [DescriptionGeneratorService],
  imports: [forwardRef(() => ProductsModule)],
})
export class DescriptionGeneratorModule {}
