export const PasswordService = jest.fn().mockReturnValue({
  hashPassword: jest.fn().mockImplementation((pass) => `hashed-${pass}`),
  verifyPassword: jest
    .fn()
    .mockImplementation((newPass, dbPass) => dbPass === `hashed-${newPass}`),
});
