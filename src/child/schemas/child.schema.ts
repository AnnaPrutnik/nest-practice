import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Parent } from 'src/parent/schemas/parent.schema';
import { Gender } from 'src/common/enums/gender.enum';
import * as moment from 'moment';

export type ChildDocument = HydratedDocument<Child>;

@Schema({
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
export class Child {
  @ApiProperty({
    name: 'name',
    example: 'Kate',
    description: 'child name',
  })
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    name: 'birthday',
    example: '2015-03-05',
    description: 'child birthday',
  })
  @Prop()
  birthday: Date;

  @ApiProperty({
    name: 'gender',
    example: 'male',
    description: 'gender can be "male" or "female"',
  })
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true, enum: Gender })
  gender: Gender;

  @ApiProperty({
    name: 'parent',
    example: 'mongoId',
    description: 'ref to parent profile',
  })
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Parent' })
  parent: Parent;

  @Prop({ default: false, select: false })
  isDeleted: boolean;
}

export const ChildSchema = SchemaFactory.createForClass(Child);

ChildSchema.virtual('age').get(function () {
  return moment().diff(this.birthday, 'years');
});
