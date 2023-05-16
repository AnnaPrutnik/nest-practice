import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
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
export class User {
  @ApiProperty({ example: 'username@mail.com', description: 'email' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: '123456', description: 'password' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: 'Parent', description: 'parent' })
  @Prop({
    type: String,
    default: Role.Parent,
    enum: Role,
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
