import { Role } from 'src/common/enums/role.enum';
import { CreateUserDto } from '../dto/create-user.dto';

export const testPassword = '123456';

export const usersForDB: CreateUserDto[] = [
  {
    email: 'email1@mail.com',
    password: testPassword,
    role: Role.Nanny,
  },
  {
    email: 'email2@mail.com',
    password: testPassword,
    role: Role.Admin,
  },
  {
    email: 'email3@mail.com',
    password: testPassword,
    role: Role.Parent,
  },
];
