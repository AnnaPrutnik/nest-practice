import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type TokenDocument = HydratedDocument<Token>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Token {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
