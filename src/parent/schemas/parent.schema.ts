import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Child } from 'src/child/schemas/child.schema';

export type ParentDocument = HydratedDocument<Parent>;

@Schema({
  _id: false,
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.isActive;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.isActive;
      return ret;
    },
  },
})
export class Parent {
  @ApiProperty({
    name: 'id',
    example: '643562541bd65114fc504c1e',
    description: 'parent id - the same id in user collection',
  })
  @Prop({
    required: true,
    index: true,
  })
  _id: string;

  @ApiProperty({
    name: 'firstName',
    example: 'firstName',
    description: 'first name',
  })
  @Prop()
  firstName: string;

  @ApiProperty({
    name: 'lastName',
    example: 'lastName',
    description: 'last name',
  })
  @Prop()
  lastName: string;

  @ApiProperty({
    name: 'birthday',
    example: '1983-15-01',
    description: 'birthday',
  })
  @Prop()
  birthday: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);

ParentSchema.virtual('children', {
  ref: Child.name,
  localField: '_id',
  foreignField: 'parent',
});
