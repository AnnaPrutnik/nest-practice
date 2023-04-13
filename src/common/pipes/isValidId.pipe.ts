import { IsMongoId } from 'class-validator';

export class IsValidMongoId {
  @IsMongoId()
  userId: string;
}
