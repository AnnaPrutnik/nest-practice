import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsMongoId,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Parent } from 'src/parent/schemas/parent.schema';
import { Nanny } from 'src/nanny/schemas/nanny.schema';
import { Child } from 'src/child/schemas/child.schema';
import { Status } from 'src/common/enums/status.enum';

export type HireDocument = HydratedDocument<Hire>;

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
export class Hire {
  @ApiProperty({
    name: 'parent',
    example: 'mongoId',
    description: 'ref to parent profile',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Parent' })
  parent: Parent;

  @ApiProperty({
    name: 'nanny',
    example: 'mongoId',
    description: 'ref to nanny profile',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Nanny' })
  nanny: Nanny;

  @ApiProperty({
    name: 'children',
    example: 'array of mongoId',
    description: 'ref to child profiles',
  })
  @IsNotEmpty()
  @IsArray()
  @Prop({
    required: true,
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Child',
      },
    ],
  })
  children: Child[];

  @ApiProperty({
    name: 'date',
    example: '2015-03-05',
    description: 'the day when the nanny is hired',
  })
  @IsDateString()
  @IsNotEmpty()
  @Prop()
  date: Date;

  @ApiProperty({
    name: 'status',
    example: 'active',
    description: 'the status for hiring: active | complete | cancel',
  })
  @IsOptional()
  @IsEnum(Status)
  @Prop({ default: Status.Scheduled, enum: Status })
  status: Status;
}

export const HireSchema = SchemaFactory.createForClass(Hire);
