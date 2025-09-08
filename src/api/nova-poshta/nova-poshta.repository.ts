import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ReadNovaPoshtaSettingsDto } from './dto/read-nova-poshta-settings.dto';

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

    return settings as ReadNovaPoshtaSettingsDto;
  }
}
