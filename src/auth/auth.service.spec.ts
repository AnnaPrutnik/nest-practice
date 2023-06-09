import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PasswordService } from 'src/user/password.service';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Token, TokenSchema } from 'src/token/schemas/token.schema';

jest.mock('src/user/user.service');
jest.mock('src/user/password.service');
jest.mock('src/token/token.service.ts');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        TokenService,
        PasswordService,
        JwtService,
        ConfigService,
        { provide: getModelToken(User.name), useValue: UserSchema },
        { provide: getModelToken(Token.name), useValue: TokenSchema },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
