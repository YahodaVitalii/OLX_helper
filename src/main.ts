import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import config from './swagger/config';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './exception/prisma-client-exception/prisma-client-exception.filter';
async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}`),
  );
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
