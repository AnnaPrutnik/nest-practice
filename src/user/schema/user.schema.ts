import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLE } from '../../../config/role';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: ROLE.CUSTOMER, enum: { values: Object.values(ROLE) } })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
