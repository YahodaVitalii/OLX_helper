import { Module } from '@nestjs/common';
import { OlxController } from './olx.controller';
import { OlxService } from './olx.service';

@Module({
  imports: [],
  controllers: [OlxController],
  providers: [OlxService],
})
export class OlxModule {}
