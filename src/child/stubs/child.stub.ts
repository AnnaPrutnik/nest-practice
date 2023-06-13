import * as mongoose from 'mongoose';
import { Gender } from 'src/common/enums/gender.enum';

export const createChildDto = {
  name: 'Mark',
  birthday: new Date('2016-05-03'),
  gender: Gender.Male,
};

export const userId = new mongoose.Types.ObjectId();
