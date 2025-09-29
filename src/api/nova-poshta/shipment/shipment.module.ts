import { forwardRef, Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { PrismaService } from '../../../prisma.service';
import { ConfigService } from '@nestjs/config';
import { NovaPoshtaModule } from '../nova-poshta.module';
import { UsersModule } from '../../users/users.module';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService, PrismaService, ConfigService],
  imports: [forwardRef(() => NovaPoshtaModule), UsersModule],
})
export class ShipmentModule {}
