import { UserDocument } from '../schemas/user.schema';
import { Role } from 'src/common/enums/role.enum';
import { CreateUserDto } from '../dto/create-user.dto';

const user = {
  _id: '643e8b025c6ac99fe1c6ba85',
  email: 'emailNanny1@mail.com',
  password: '123456',
  role: Role.Nanny,
};

const users = [
  user,
  {
    _id: '643faff17305509f3c6b2c54',
    email: 'emailNanny2@mail.com',
    password: '$2b$10$JPE/9BBR.l.t.mHq8V5Kku1n/2eIB4fLAhB6U8On04prGfEujyZt2',
    role: Role.Nanny,
  },
  {
    _id: '643fed1e45f45aa7e0bc8830',
    email: 'user@mail.com',
    password: '$2b$10$clarokVHKxhL6LzzJhsc0OE.jwVSjcek74Wm2po/hLXueCLC.B8hG',
    role: Role.Nanny,
  },
  {
    _id: '6440ea476dfa7c9c178a4f85',
    email: 'emailNanny3@mail.com',
    password: '$2b$10$.tHv1kJov3btcb9bGpkHm.W/yfE3Ydum0T6A4Qs3gzXfKmzfW2uyu',
    role: Role.Nanny,
  },
];

export const userStub = (): UserDocument => {
  return user as unknown as UserDocument;
};

export const usersStub = () => {
  return {
    users,
    total: 4,
    page: 1,
    pages: 1,
  };
};

export const createUserDtoStub = (): CreateUserDto => {
  return {
    email: user.email,
    password: user.password,
    role: user.role,
  };
};
