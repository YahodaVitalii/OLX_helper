import { Module } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';
import { ProductsModule } from './api/products/products.module';
import { LaptopsModule } from './api/products/product-types/laptops/laptops.module';
import * as process from 'node:process';
import { DescriptionGeneratorModule } from './description-generator/description-generator.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    AuthModule,
    ProductsModule,
    LaptopsModule,
    DescriptionGeneratorModule,
    S3Module,
  ],
})
export class AppModule {}
