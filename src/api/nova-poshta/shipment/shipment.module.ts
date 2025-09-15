import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { PrismaService } from '../../../prisma.service';
import { ConfigService } from '@nestjs/config';
import { NovaPoshtaModule } from '../nova-poshta.module';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService, PrismaService, ConfigService],
  imports: [NovaPoshtaModule],
})
export class ShipmentModule {}
