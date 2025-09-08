import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { NovaPoshtaService } from './nova-poshta.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../auth/auth.decorator';
import { RequestUserContext } from '../../types/Express/req-user-context.interface';
import { CreateNovaPoshtaSettingsDto } from './dto/create-nova-poshta-settings.dto';

@ApiTags('Nova Poshta Settings')
@Controller('nova-poshta')
@Auth()
export class NovaPoshtaController {
  constructor(private readonly novaPoshtaService: NovaPoshtaService) {}

  @Get('settings')
  @ApiOperation({
    summary: 'Get Nova Poshta settings for the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Settings not found' })
  async getSettings(@Req() req: RequestUserContext) {
    return this.novaPoshtaService.getNovaPoshtaSettings(req.user.userId);
  }

  @Post('settings')
  @ApiOperation({ summary: 'Save Nova Poshta settings for current user' })
  @ApiResponse({ status: 201, description: 'Settings successfully saved.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid Nova Poshta API key or city.',
  })
  async saveSettings(
    @Req() req: RequestUserContext,
    @Body() dto: CreateNovaPoshtaSettingsDto,
  ) {
    const userId = req.user.userId;
    return this.novaPoshtaService.saveUserSettings(userId, dto);
  }
}
