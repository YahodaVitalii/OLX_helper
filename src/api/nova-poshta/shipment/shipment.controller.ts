import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentService } from './shipment.service';
import { Auth } from '../../auth/auth.decorator';
import { RequestUserContext } from '../../../types/Express/req-user-context.interface';

@ApiTags('Nova Poshta Shipments')
@Controller('nova-poshta/shipments')
@Auth()
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Nova Poshta shipment' })
  @ApiResponse({ status: 201, description: 'Shipment successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data or failed request.' })
  @ApiResponse({
    status: 404,
    description: 'Product not found or not owned by user.',
  })
  async createShipment(
    @Req() req: RequestUserContext,
    @Body() dto: CreateShipmentDto,
  ) {
    const userId = req.user.userId;
    return this.shipmentService.createShipment(userId, dto);
  }
}
