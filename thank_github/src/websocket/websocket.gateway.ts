import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from "@nestjs/websockets";
import { Socket } from "dgram";

// 注意ws端口号不能和http端口号一样，否则会冲突
@WebSocketGateway(3002,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
}

)
export class WsStartGateway {
  // 处理WebSocket事件的方法
  // SubscribeMessage里面的字符串代表类型，就是send event的值
  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    console.log('ws hello data', data);
    const event = "events";
    return {
      event,
      data: {
        msg: 'ws 收到信息后返回'
      },
    };
  }
}