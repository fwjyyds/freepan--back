import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WsStartGateway } from './websocket.gateway';

@Module({
  providers: [WsStartGateway, WebsocketService],
})
export class WebsocketModule {}
