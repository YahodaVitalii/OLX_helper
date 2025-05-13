import { DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('OLX Helper')
  .setDescription('Documentation REST API')
  .setVersion('1.0.0')
  .build();

export default config;
