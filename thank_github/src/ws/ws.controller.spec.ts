import { Test, TestingModule } from '@nestjs/testing';
import { WsController } from './ws.controller';
import { WsService } from './ws.service';

describe('WsController', () => {
  let controller: WsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WsController],
      providers: [WsService],
    }).compile();

    controller = module.get<WsController>(WsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
