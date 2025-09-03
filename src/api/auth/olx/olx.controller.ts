import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('api/auth/olx')
export class OlxController {
  @Get('callback')
  handleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.status(HttpStatus.BAD_REQUEST).send('Code is missing');
    }

    return res
      .status(HttpStatus.OK)
      .send(`Callback received successfully! Code: ${code}`);
  }
}
