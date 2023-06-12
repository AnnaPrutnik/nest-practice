import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';
import { UserDocument } from 'src/user/schemas/user.schema';

export const hashPass = (pass: string) => bcrypt.hashSync(pass, 5);
const userId = new mongoose.Types.ObjectId();
const testPassword = 'password';

export const testUser = {
  id: userId,
  email: 'test@mail.com',
  password: hashPass(testPassword),
  role: Role.Admin,
} as UserDocument;

export const createDto = {
  email: testUser.email,
  password: testPassword,
  role: Role.Admin,
};
