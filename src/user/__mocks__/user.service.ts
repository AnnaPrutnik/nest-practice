import { userStub, usersStub } from '../stubs/user.stub';

export const UserService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub()),
  getAll: jest.fn().mockResolvedValue(usersStub()),
  getById: jest.fn().mockResolvedValue(userStub()),
  getByEmail: jest.fn().mockResolvedValue(userStub()),
  updateRole: jest.fn().mockResolvedValue(userStub()),
  updatePassword: jest.fn().mockResolvedValue(userStub()),
});
