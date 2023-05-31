import { UserDocument } from '../schemas/user.schema';
import { Role } from 'src/common/enums/role.enum';
import { CreateUserDto } from '../dto/create-user.dto';

const userNanny = {
  id: '643e8b025c6ac99fe1c6ba85',
  email: 'emailNanny@mail.com',
  password: '123456',
  role: Role.Nanny,
};

const userParent = {
  id: '643e8b025c6ac99fe1c6ba56',
  email: 'emailParent@mail.com',
  password: '123456',
  role: Role.Parent,
};

const userAdmin = {
  id: '643e8b025c6ac99fe1c6ba86',
  email: 'emailAdmin@mail.com',
  password: '123456',
  role: Role.Admin,
};

const users = [userNanny, userParent, userAdmin];

export const userStub = (): UserDocument => {
  return userNanny as unknown as UserDocument;
};

export const usersStub = () => {
  return {
    users,
    total: 3,
    page: 1,
    pages: 1,
  };
};

export const createUserDtoStub = (): CreateUserDto[] => {
  return users.map((user) => ({
    email: user.email,
    password: user.password,
    role: user.role,
  }));
};
