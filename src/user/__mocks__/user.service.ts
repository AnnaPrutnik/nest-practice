import { Role } from 'src/common/enums/role.enum';
import { userStub, usersStub } from '../stubs/user.stub';

export const UserService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub()),
  getAll: jest.fn().mockResolvedValue(usersStub()),
  getById: jest.fn().mockImplementation((id: string) => {
    if (id === userStub().id) return userStub();
    return null;
  }),
  getByEmail: jest.fn().mockImplementation((id: string) => {
    if (id === userStub().id) return userStub();
    return null;
  }),

  updateRole: jest.fn().mockImplementation((id: string, newRole: Role) => {
    const user = userStub();
    if (id === user.id) {
      user.role = newRole;
      return user;
    }
    return null;
  }),

  updatePassword: jest
    .fn()
    .mockImplementation((id: string, newPassword: Role) => {
      const user = userStub();
      if (id !== user.id) {
        return null;
      }

      if (user.password === newPassword) {
        return null;
      }

      return 'success';
    }),
});
