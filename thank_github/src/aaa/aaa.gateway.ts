import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';

@WebSocketGateway()
export class AaaGateway {
  constructor(private readonly aaaService: AaaService) {}

  @SubscribeMessage('createAaa')
  create(@MessageBody() createAaaDto: CreateAaaDto) {
    return this.aaaService.create(createAaaDto);
  }

  @SubscribeMessage('findAllAaa')
  findAll() {
    return this.aaaService.findAll();
  }

  @SubscribeMessage('findOneAaa')
  findOne(@MessageBody() id: number) {
    return this.aaaService.findOne(id);
  }

  @SubscribeMessage('updateAaa')
  update(@MessageBody() updateAaaDto: UpdateAaaDto) {
    return this.aaaService.update(updateAaaDto.id, updateAaaDto);
  }

  @SubscribeMessage('removeAaa')
  remove(@MessageBody() id: number) {
    return this.aaaService.remove(id);
  }
}
