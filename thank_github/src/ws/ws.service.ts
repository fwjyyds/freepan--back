import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'

@WebSocketGateway({ cors: { origin: '*' } })
export class WsService {
        @SubscribeMessage('newMessage')
        handleMessage(@MessageBody() body: any) {
                console.log(body);
        }
}