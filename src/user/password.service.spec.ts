import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserController } from './user.controller';
import { PasswordService } from './password.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

jest.mock('@nestjs/config');

describe('PasswordService', () => {
  let passwordService: PasswordService;
  let configService: ConfigService;
  let password: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PasswordService,

        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        { provide: getModelToken(User.name), useValue: UserSchema },
      ],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
    configService = module.get<ConfigService>(ConfigService);
    password = 'some-pass';
  });

  it('should be defined', () => {
    expect(passwordService).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should return 10 if SALT_ROUND equal 10', async () => {
      jest.spyOn(configService, 'get').mockReturnValue('10');
      const bcryptFn = jest.spyOn(bcrypt, 'hash');
      await passwordService.hashPassword(password);
      expect(bcryptFn).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('verifyPassword', () => {
    let hashPass: string;

    beforeEach(async () => {
      hashPass = await passwordService.hashPassword(password);
    });

    it('should return true if password the same', async () => {
      const result = await passwordService.verifyPassword(password, hashPass);
      expect(result).toBeTruthy();
    });

    it('should return false if password the same', async () => {
      const result = await passwordService.verifyPassword('other', hashPass);
      expect(result).toBeFalsy();
    });

    it('should return falsy if first argument is undefined', async () => {
      const result = await passwordService.verifyPassword(undefined, hashPass);
      expect(result).toBeFalsy();
    });

    it('should return falsy if second argument is undefined', async () => {
      const result = await passwordService.verifyPassword(password, undefined);
      expect(result).toBeFalsy();
    });
  });
});
