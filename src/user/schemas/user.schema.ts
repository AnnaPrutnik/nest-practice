import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../interface/role.enum';
import { NextFunction } from 'express';

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
  @ApiProperty({ example: 'username', description: 'username' })
  @Prop()
  username: string;

  @ApiProperty({ example: 'username@mail.com', description: 'email' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: '123456', description: 'password' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: 'Parent', description: '' })
  @Prop({
    type: String,
    default: Role.Parent,
    enum: Role,
  })
  role: Role;

  isValidPassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: NextFunction) {
  if (this.isModified('password')) {
    const salt = Number(process.env.SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
