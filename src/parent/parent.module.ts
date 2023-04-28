import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { ParentSchema, Parent } from './schemas/parent.schema';
import { ChildModule } from 'src/child/child.module';

@Module({
  imports: [
    ChildModule,
    MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
  ],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
