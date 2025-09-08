import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { NovaPoshtaRepository } from './nova-poshta.repository';
import { CreateNovaPoshtaSettingsDto } from './dto/create-nova-poshta-settings.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

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
    const senderRef = await this.getSenderRef(dto.apiKey);
    const cityRef = await this.getCityRef(dto.apiKey, dto.cityName);

    // Save in DB
    return this.prisma.novaPoshtaSettings.upsert({
      where: { userId },
      update: {
        apiKey: dto.apiKey,
        senderRef,
        cityRef,
      },
      create: {
        userId,
        apiKey: dto.apiKey,
        senderRef,
        cityRef,
      },
    });
  }

  /**
   * Fetch senderRef from Nova Poshta API
   */
  private async getSenderRef(apiKey: string): Promise<string> {
    try {
      const response = await axios.post(this.NOVA_POSHTA_API_URL, {
        apiKey,
        modelName: 'Counterparty',
        calledMethod: 'getCounterparties',
        methodProperties: {
          CounterpartyProperty: 'Sender',
          Page: '1',
        },
      });

      if (!response.data?.success || !response.data.data?.length) {
        throw new BadRequestException(
          'Invalid Nova Poshta API key or sender not found',
        );
      }

      return response.data.data[0].Ref;
    } catch (error) {
      console.error(
        'Error fetching senderRef:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to fetch senderRef from Nova Poshta',
      );
    }
  }

  /**
   * Fetch cityRef by city name
   */
  private async getCityRef(apiKey: string, cityName: string): Promise<string> {
    try {
      const response = await axios.post(this.NOVA_POSHTA_API_URL, {
        apiKey,
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {
          FindByString: cityName,
        },
      });

      if (!response.data?.success || !response.data.data?.length) {
        throw new BadRequestException('City not found in Nova Poshta');
      }

      return response.data.data[0].Ref;
    } catch (error) {
      console.error(
        'Error fetching cityRef:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to fetch cityRef from Nova Poshta',
      );
    }
  }
}
