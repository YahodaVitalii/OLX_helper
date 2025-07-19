import { forwardRef, Module } from '@nestjs/common';
import { ProductAdvertRepository } from './product-adverts.repository';
import { ProductAdvertService } from './product-adverts.service';
import { PrismaService } from '../../../prisma.service';
import { DescriptionGeneratorModule } from '../../../description-generator/description-generator.module';

@Module({
  providers: [ProductAdvertService, PrismaService, ProductAdvertRepository],
  exports: [ProductAdvertService],
  imports: [forwardRef(() => DescriptionGeneratorModule)],
})
export class ProductAdvertsModule {}
