import { IsMongoId } from 'class-validator';

export class IsValidMongoId {
  @IsMongoId()
  id: string;
}
