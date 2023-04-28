import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hire, HireSchema } from './schemas/hire.schema';
import { HireService } from './hire.service';
import { HireController } from './hire.controller';
import { ChildModule } from 'src/child/child.module';
import { NannyModule } from 'src/nanny/nanny.module';

@Module({
  imports: [
    ChildModule,
    NannyModule,
    MongooseModule.forFeature([
      {
        name: Hire.name,
        schema: HireSchema,
      },
    ]),
  ],
  controllers: [HireController],
  providers: [HireService],
})
export class HireModule {}
