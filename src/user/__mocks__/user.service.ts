export const UserService = jest.fn().mockReturnValue({
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
  getByEmail: jest.fn(),
  updateRole: jest.fn(),
  updatePassword: jest.fn(),
});
