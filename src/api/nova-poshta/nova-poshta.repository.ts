import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ReadNovaPoshtaSettingsDto } from './dto/read-nova-poshta-settings.dto';
import { UpsertNovaPoshtaSettingsDto } from './dto/upsert-nova-poshta-settings.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class NovaPoshtaRepository {
  constructor(private prisma: PrismaService) {}

  async getNovaPoshtaSettings(userId: number) {
    const settings = await this.prisma.novaPoshtaSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      throw new BadRequestException(
        'Nova Poshta settings not configured for this user',
      );
    }

    return plainToInstance(ReadNovaPoshtaSettingsDto, settings);
  }
  async upsertUserSettings(userId: number, data: UpsertNovaPoshtaSettingsDto) {
    return this.prisma.novaPoshtaSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}
