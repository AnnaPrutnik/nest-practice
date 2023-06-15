import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { WorkdaysSchema, Workdays } from './workdays.schema';

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

  @ApiProperty({ example: 'firstName', description: 'first name' })
  @Prop()
  firstName: string;

  @ApiProperty({ example: 'lastName', description: 'last name' })
  @Prop()
  lastName: string;

  @ApiProperty({ example: '1973-15-01', description: 'nanny birthday' })
  @Prop()
  birthday: Date;

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
  @Prop({ type: Workdays, required: true })
  workdays: Workdays;

  @Prop({ default: false, select: false })
  isDeleted: boolean;
}

export const NannySchema = SchemaFactory.createForClass(Nanny);

// NannySchema.virtual('id').get(function () {
//   return this._id.toString();
// });
