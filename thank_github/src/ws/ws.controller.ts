import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WsService } from './ws.service';
import { CreateWDto } from './dto/create-w.dto';
import { UpdateWDto } from './dto/update-w.dto';
import { MessageBody, SubscribeMessage, WebSocketGateway,ConnectedSocket} from '@nestjs/websockets'
import type { Socket } from 'socket.io';
@Controller('ws')
export class WsController {
  constructor(private readonly wsService: WsService) {}
        @SubscribeMessage('newMessage')
        handleMessage(@MessageBody() body: any) {
                console.log(body);
        }
        @SubscribeMessage('sendMessage')
        sendMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket,) {
                client.emit('onMessage')
                console.log(body);
        }


}
