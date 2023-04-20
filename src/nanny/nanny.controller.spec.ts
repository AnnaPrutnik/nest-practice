import { Test, TestingModule } from '@nestjs/testing';
import { NannyController } from './nanny.controller';
import { NannyService } from './nanny.service';

describe('NannyController', () => {
  let controller: NannyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NannyController],
      providers: [NannyService],
    }).compile();

    controller = module.get<NannyController>(NannyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
