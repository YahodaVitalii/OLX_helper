import { Module } from '@nestjs/common';
import { NovaPoshtaService } from './nova-poshta.service';
import { NovaPoshtaController } from './nova-poshta.controller';
import { ShipmentModule } from './shipment/shipment.module';

@Module({
  controllers: [NovaPoshtaController],
  providers: [NovaPoshtaService],
  imports: [ShipmentModule],
})
export class NovaPoshtaModule {}
