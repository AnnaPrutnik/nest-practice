import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PasswordService } from 'src/user/password.service';
import { TokenService } from 'src/token/token.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Token, TokenSchema } from 'src/token/schemas/token.schema';
import { testUser, createDto } from './stubs/auth.stub';

jest.mock('src/user/user.service');
jest.mock('src/user/password.service');
jest.mock('src/token/token.service.ts');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let passwordService: PasswordService;
  let tokenService: TokenService;
  const testUserAgent = 'Mozilla Firefox 3.4';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        TokenService,
        PasswordService,
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
        { provide: getModelToken(User.name), useValue: UserSchema },
        { provide: getModelToken(Token.name), useValue: TokenSchema },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should return object with tokens', async () => {
      const tokens = {
        refreshToken: 'refresh',
        accessToken: 'access',
      };

      const getUserSpy = jest.spyOn(userService, 'getByEmail');
      getUserSpy.mockReturnValue(null);
      const createUserSpy = jest.spyOn(userService, 'create');
      createUserSpy.mockResolvedValue(testUser);
      const createTokenSpy = jest.spyOn(tokenService, 'create');
      createTokenSpy.mockResolvedValue(tokens);

      const result = await authService.signUp(createDto, testUserAgent);

      expect(result).toMatchObject(tokens);
      expect(getUserSpy).toHaveBeenCalledWith(testUser.email);
      expect(createUserSpy).toHaveBeenCalledWith(createDto);
      expect(createTokenSpy).toHaveBeenCalledWith(testUser.id, testUserAgent);
    });

    it('should throw BadRequest if user have been already sign up', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(testUser);

      await expect(
        authService.signUp(createDto, testUserAgent),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('signIn', () => {
    it('should return object with tokens', async () => {
      const tokens = {
        refreshToken: 'refresh',
        accessToken: 'access',
      };

      const getUserSpy = jest.spyOn(userService, 'getByEmail');
      getUserSpy.mockResolvedValue(testUser);
      const passwordVerifySpy = jest.spyOn(passwordService, 'verifyPassword');
      passwordVerifySpy.mockResolvedValue(true);
      const createTokenSpy = jest.spyOn(tokenService, 'create');
      createTokenSpy.mockResolvedValue(tokens);

      const result = await authService.signIn(
        createDto.email,
        createDto.password,
        testUserAgent,
      );

      expect(result).toMatchObject(tokens);
      expect(getUserSpy).toHaveBeenCalledWith(createDto.email);
      expect(passwordVerifySpy).toHaveBeenCalledWith(
        createDto.password,
        testUser.password,
      );
      expect(createTokenSpy).toHaveBeenCalledWith(testUser.id, testUserAgent);
    });

    it('should throw BadRequestException if password is wrong', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(testUser);
      jest.spyOn(passwordService, 'verifyPassword').mockResolvedValue(false);

      await expect(
        authService.signIn(createDto.email, createDto.password, testUserAgent),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if email not exist', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(null);

      await expect(
        authService.signIn(createDto.email, createDto.password, testUserAgent),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('refresh', () => {
    it('should have been called tokenService.updateRefreshToken', async () => {
      const refreshToken = 'refreshToken';
      const tokens = {
        refreshToken: 'refresh',
        accessToken: 'access',
      };
      const updateRefreshTokenSpy = jest.spyOn(
        tokenService,
        'updateRefreshToken',
      );

      updateRefreshTokenSpy.mockResolvedValue(tokens);

      await authService.refresh(refreshToken, testUserAgent);

      expect(updateRefreshTokenSpy).toHaveBeenCalledWith(
        refreshToken,
        testUserAgent,
      );
    });

    it('should return UnauthorizedException if token is not valid', async () => {
      const refreshToken = 'refreshToken';
      jest
        .spyOn(tokenService, 'updateRefreshToken')
        .mockResolvedValueOnce(null);
      await expect(
        authService.refresh(refreshToken, testUserAgent),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should have been called tokenService.removeRefreshToken', async () => {
      const id = 'id';
      const removeTokenSpy = jest.spyOn(tokenService, 'removeRefreshToken');

      await authService.logout(id, testUserAgent);

      expect(removeTokenSpy).toHaveBeenCalledWith(id, testUserAgent);
    });

    it('should return undefined', async () => {
      const result = await authService.logout('id', testUserAgent);
      expect(result).toBeUndefined();
    });
  });
});
