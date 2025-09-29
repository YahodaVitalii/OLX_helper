import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { PrismaService } from '../../../prisma.service';
import { ConfigService } from '@nestjs/config';
import { NovaPoshtaService } from '../nova-poshta.service';
import { ReadNovaPoshtaSettingsDto } from '../dto/read-nova-poshta-settings.dto';
import { ReadProductDto } from '../../products/product-dto/read-product.dto';
import { NovaPoshtaInternetDocumentPayload } from './interface/nova-poshta-internet-document.interface';
import { UsersService } from '../../users/users.service';
import { ReadUserDto } from '../../users/dto/read-user.dto';
import * as CONST from '../../../constants';

@Injectable()
export class ShipmentService {
  private readonly NOVA_POSHTA_API_URL: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly novaPoshtaService: NovaPoshtaService,
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    this.NOVA_POSHTA_API_URL =
      this.configService.get<string>('NOVA_POSHTA_API')!;
  }

  async createShipment(userId: number, dto: CreateShipmentDto) {
    // 1. Validate product ownership
    const product = await this.validateProductOwnership(userId, dto.productId);

    // 2. Get Nova Poshta settings for the user
    const npSettings =
      await this.novaPoshtaService.getNovaPoshtaSettings(userId);

    const user = await this.userService.getUserById(userId);

    // 3. Build Nova Poshta payload
    const payload = this.buildNovaPoshtaPayload(
      npSettings,
      product,
      dto,
      user as ReadUserDto,
    );

    // 4. Call Nova Poshta API
    const ttn = await this.callNovaPoshtaApi(payload);

    // 5. Save shipment & update product
    const shipment = await this.saveShipment(userId, product.id, dto, ttn);

    return {
      message: 'Shipment created successfully',
      shipment,
    };
  }

  private async validateProductOwnership(userId: number, productId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, userId },
    });

    if (!product) {
      throw new NotFoundException('Product not found or not owned by user');
    }

    return product;
  }

  private buildNovaPoshtaPayload(
    npSettings: ReadNovaPoshtaSettingsDto,
    product: ReadProductDto,
    shipmentDto: CreateShipmentDto,
    user: ReadUserDto,
  ): NovaPoshtaInternetDocumentPayload {
    if (!npSettings.senderRef || !npSettings.cityRef || !npSettings.apiKey) {
      throw new BadRequestException('Invalid Nova Poshta settings');
    }
    return {
      apiKey: npSettings.apiKey,
      modelName: CONST.NOVA_POSHTA_MODEL_NAMES.INTERNET_DOCUMENT,
      calledMethod: CONST.NOVA_POSHTA_METHODS.SAVE,
      methodProperties: {
        NewAddress: CONST.NOVA_POSHTA_DEFAULTS.NEW_ADDRESS,
        PayerType: CONST.NOVA_POSHTA_DEFAULTS.PAYER_TYPE,
        PaymentMethod: CONST.NOVA_POSHTA_DEFAULTS.PAYMENT_METHOD,
        CargoType: CONST.NOVA_POSHTA_DEFAULTS.CARGO_TYPE,
        Weight:
          shipmentDto.weight?.toString() ??
          CONST.NOVA_POSHTA_DEFAULTS.DEFAULT_WEIGHT,
        ServiceType: CONST.NOVA_POSHTA_DEFAULTS.SERVICE_TYPE,
        SeatsAmount: CONST.NOVA_POSHTA_DEFAULTS.SEATS_AMOUNT,
        Description:
          product.name || CONST.NOVA_POSHTA_DEFAULTS.DEFAULT_DESCRIPTION,

        Cost: product.ProductFinance?.sellingPrice
          ? Number(product.ProductFinance.sellingPrice)
          : 0,

        CitySender: npSettings.cityRef,
        Sender: npSettings.senderRef,
        SenderAddress: npSettings.senderAddressRef,
        ContactSender: npSettings.contactPersonRef,
        SendersPhone: user.phoneNumber,
        RecipientCity: shipmentDto.recipientCityRef,
        RecipientAddress: shipmentDto.recipientAddressRef,
        RecipientName: shipmentDto.recipientName,
        RecipientType: CONST.NOVA_POSHTA_DEFAULTS.RECIPIENT_TYPE,
        RecipientsPhone: shipmentDto.recipientPhone,
      },
    };
  }

  /**
   * Send request to Nova Poshta API and return TTN
   */
  private async callNovaPoshtaApi(payload: any): Promise<string> {
    try {
      const response = await axios.post(this.NOVA_POSHTA_API_URL, payload);

      if (!response.data?.success) {
        throw new BadRequestException(
          'Nova Poshta API error: ' + JSON.stringify(response.data.errors),
        );
      }

      const ttn = response.data.data[0]?.IntDocNumber;
      if (!ttn) {
        throw new InternalServerErrorException(
          'Failed to get TTN from Nova Poshta API',
        );
      }

      return ttn;
    } catch (error) {
      console.error(
        'Nova Poshta create shipment error:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException('Failed to create shipment');
    }
  }

  /**
   * Save shipment in the database and update product status
   */
  private async saveShipment(
    userId: number,
    productId: number,
    dto: CreateShipmentDto,
    ttn: string,
  ) {
    // Create shipment
    const shipment = await this.prisma.shipment.create({
      data: {
        ttn,
        status: 'CREATED',
        productId,
        userId,
        recipientCityRef: dto.recipientCityRef,
        recipientAddressRef: dto.recipientAddressRef,
        recipientPhone: dto.recipientPhone,
        recipientName: dto.recipientName,
      },
    });

    // Update product status
    await this.prisma.product.update({
      where: { id: productId },
      data: { status: 'PENDING_DELIVERY' },
    });

    return shipment;
  }
}
