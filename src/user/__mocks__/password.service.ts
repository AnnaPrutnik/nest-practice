export const PasswordService = jest.fn().mockReturnValue({
  hashPassword: jest.fn().mockResolvedValue('some-string-password'),
  verifyPassword: jest.fn().mockResolvedValue(true),
});
