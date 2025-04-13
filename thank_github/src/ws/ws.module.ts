import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsController } from './ws.controller';

@Module({
  controllers: [WsController],
  providers: [WsService],
})
export class WsModule {}
