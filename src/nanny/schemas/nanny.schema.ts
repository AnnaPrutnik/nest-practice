import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/schemas/user.schema';
import { Workdays } from '../interface/workdays.interface';

export type NannyDocument = HydratedDocument<Nanny>;

@Schema({
  _id: false,
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      return ret;
    },
  },
})
export class Nanny {
  @ApiProperty({
    name: 'id',
    example: '643562541bd65114fc504c1e',
    description: 'nanny id - the same id in user collection',
  })
  @Prop({
    required: true,
    index: true,
  })
  _id: string;

  @ApiProperty({
    name: 'childMinAge',
    example: '3',
    description:
      'The minimum age of the child that a nanny is willing to sit with',
  })
  @Prop({ required: true })
  childMinAge: number;

  @ApiProperty({
    name: 'childMaxAge',
    example: '12',
    description:
      'The maximum age of the child that a nanny is willing to sit with',
  })
  @Prop({ required: true })
  childMaxAge: number;

  @ApiProperty({
    name: 'groupSize',
    example: '4',
    description: "The limit for the size of the children's group",
  })
  @Prop({ required: true })
  groupSize: number;

  @ApiProperty({
    name: 'dailyRate',
    example: '4',
    description: 'The payment due to the nanny for one day of work',
  })
  @Prop({ required: true })
  dailyRate: number;

  @ApiProperty({
    name: 'workdays',
    description: 'The days of the week when nanny is available',
  })
  @Prop({ required: true, type: Workdays })
  workdays: Workdays;
}

export const NannySchema = SchemaFactory.createForClass(Nanny);

NannySchema.virtual('user', {
  ref: 'User',
  localField: '_id',
  foreignField: '_id',
  justOne: true,
});
