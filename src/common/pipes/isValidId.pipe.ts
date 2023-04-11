import { IsMongoId } from 'class-validator';

export class IsValidMongoId {
  @IsMongoId()
  user_id: string;
}
