import { Module } from '@nestjs/common';
import { NannyService } from './nanny.service';
import { NannyController } from './nanny.controller';

@Module({
  controllers: [NannyController],
  providers: [NannyService]
})
export class NannyModule {}
