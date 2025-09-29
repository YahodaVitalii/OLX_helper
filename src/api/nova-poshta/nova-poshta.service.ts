import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { NovaPoshtaRepository } from './nova-poshta.repository';
import { CreateNovaPoshtaSettingsDto } from './dto/create-nova-poshta-settings.dto';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { ReadNovaPoshtaSettingsDto } from './dto/read-nova-poshta-settings.dto';
import { NovaPoshtaCounterpartyResponse } from './ interfaces/nova-poshta-counterparty-response.interface';
import { NovaPoshtaCityResponse } from './ interfaces/nova-poshta-city-response.interface';
import { NovaPoshtaContactPersonResponse } from './ interfaces/nova-poshta-contact-person-response.interface';
import { NovaPoshtaWarehouseResponse } from './ interfaces/nova-poshta-warehouse-response.interface';

@Injectable()
export class NovaPoshtaService {
  private readonly NOVA_POSHTA_API_URL: string;

  constructor(
    private readonly novaPoshtaRepository: NovaPoshtaRepository,
    private configService: ConfigService,
  ) {
    this.NOVA_POSHTA_API_URL =
      this.configService.get<string>('NOVA_POSHTA_API')!;
  }

  async getNovaPoshtaSettings(userId: number) {
    return this.novaPoshtaRepository.getNovaPoshtaSettings(userId);
  }

  async saveUserSettings(userId: number, dto: CreateNovaPoshtaSettingsDto) {
    // 1. Fetch Nova Poshta IDs
    const senderRef = await this.getSenderRef(dto.apiKey);
    const contactPersonRef = await this.getContactPersonRef(
      dto.apiKey,
      senderRef,
    );
    const cityRef = await this.getCityRef(dto.apiKey, dto.cityName);
    const senderAddressRef = await this.getSenderAddressRef(
      dto.apiKey,
      cityRef,
    );

    // 2. Save everything into DB
    const savedSettings = await this.novaPoshtaRepository.upsertUserSettings(
      userId,
      {
        apiKey: dto.apiKey,
        senderRef,
        cityRef,
        senderAddressRef,
        contactPersonRef,
      },
    );

    return plainToInstance(ReadNovaPoshtaSettingsDto, savedSettings);
  }

  /**
   * Fetch Nova Poshta Sender Reference
   */
  private async getSenderRef(apiKey: string): Promise<string> {
    const requestBody = {
      apiKey,
      modelName: 'Counterparty',
      calledMethod: 'getCounterparties',
      methodProperties: {
        CounterpartyProperty: 'Sender',
        Page: '1',
      },
    };

    const response =
      await this.safeNovaPoshtaCall<NovaPoshtaCounterpartyResponse>(
        requestBody,
      );

    if (!response.success || !response.data?.length) {
      throw new BadRequestException(
        'Invalid Nova Poshta API key or sender not found',
      );
    }

    return response.data[0].Ref;
  }

  /**
   * Fetch Nova Poshta Contact Person Reference
   */
  private async getContactPersonRef(
    apiKey: string,
    senderRef: string,
  ): Promise<string> {
    const requestBody = {
      apiKey,
      modelName: 'Counterparty',
      calledMethod: 'getCounterpartyContactPersons',
      methodProperties: {
        Ref: senderRef,
        Page: '1',
      },
    };

    const response =
      await this.safeNovaPoshtaCall<NovaPoshtaContactPersonResponse>(
        requestBody,
      );

    if (!response.success || !response.data?.length) {
      throw new BadRequestException('No contact person found for sender');
    }

    return response.data[0].Ref;
  }

  /**
   * Fetch City Reference
   */
  private async getCityRef(apiKey: string, cityName: string): Promise<string> {
    const requestBody = {
      apiKey,
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        FindByString: cityName,
      },
    };

    const response =
      await this.safeNovaPoshtaCall<NovaPoshtaCityResponse>(requestBody);

    if (!response.success || !response.data?.length) {
      throw new BadRequestException('City not found in Nova Poshta');
    }

    return response.data[0].Ref;
  }

  /**
   * Fetch Sender Address Reference (warehouse in that city)
   */
  private async getSenderAddressRef(
    apiKey: string,
    cityRef: string,
  ): Promise<string> {
    const requestBody = {
      apiKey,
      modelName: 'AddressGeneral',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityRef: cityRef,
      },
    };

    const response =
      await this.safeNovaPoshtaCall<NovaPoshtaWarehouseResponse>(requestBody);

    if (!response.success || !response.data?.length) {
      throw new BadRequestException('No warehouses found in sender city');
    }
    return response.data[0].Ref;
  }
  /**
   * Common safe API call
   */
  private async safeNovaPoshtaCall<T>(requestBody: unknown): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.post(
        this.NOVA_POSHTA_API_URL,
        requestBody,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Nova Poshta API error:',
          error.response?.data || error.message,
        );
      } else if (error instanceof Error) {
        console.error('Nova Poshta API error:', error.message);
      } else {
        console.error('Nova Poshta API error:', error);
      }
      throw new InternalServerErrorException('Nova Poshta request failed');
    }
  }
}
