import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NannyService } from './nanny.service';
import { NannyController } from './nanny.controller';
import { NannySchema, Nanny } from './schemas/nanny.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Nanny.name,
        schema: NannySchema,
      },
    ]),
  ],
  controllers: [NannyController],
  providers: [NannyService],
})
export class NannyModule {}
