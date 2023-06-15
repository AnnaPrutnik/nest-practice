import { Gender } from 'src/common/enums/gender.enum';
import { Parent } from 'src/parent/schemas/parent.schema';

export interface IChild {
  id: string;
  age: number;
  name: string;
  birthday: Date;
  gender: Gender;
  parent: Parent;
}
