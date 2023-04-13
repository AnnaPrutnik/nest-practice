import { Test, TestingModule } from '@nestjs/testing';
import { NannyService } from './nanny.service';

describe('NannyService', () => {
  let service: NannyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NannyService],
    }).compile();

    service = module.get<NannyService>(NannyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
