import { Module } from '@nestjs/common';
import { NovaPoshtaService } from './nova-poshta.service';
import { NovaPoshtaController } from './nova-poshta.controller';
import { NovaPoshtaRepository } from './nova-poshta.repository';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [NovaPoshtaController],
  providers: [
    NovaPoshtaService,
    NovaPoshtaRepository,
    ConfigService,
    PrismaService,
  ],
  exports: [NovaPoshtaService],
})
export class NovaPoshtaModule {}
