import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { DateTime } from 'luxon';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  connectDB,
  dropDB,
  dropCollections,
} from 'src/test-utils/mongo/MongooseTestModule';
import { TokenService } from './token.service';
import {
  Token,
  TokenDocument,
  TokenSchema,
} from 'src/token/schemas/token.schema';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  let tokenModel: mongoose.Model<Token>;
  let testToken: TokenDocument;

  let mongoUri: string;

  beforeAll(async () => {
    mongoUri = await connectDB();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
      ],
      providers: [
        TokenService,

        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(
              ({ id }) => `Header.${id}.${DateTime.now().toFormat('x')}`,
            ),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') {
                return 'some-jwt-secret';
              }

              if (key === 'REFRESH_EXPIRE') {
                return '8';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    tokenModel = module.get<mongoose.Model<Token>>(getModelToken(Token.name));
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const userId = new mongoose.Types.ObjectId();
    const refreshToken = await randomBytes(16).toString('hex');
    const expires = DateTime.now().plus({ days: 1 });
    const userAgent = 'Mozilla Firefox 3.0';
    testToken = await tokenModel.create({
      userId,
      refreshToken,
      expires,
      userAgent,
    });
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await dropDB();
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('create', () => {
    it('should return refresh and access tokens', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const userAgent = 'Some Agent';
      const result = await tokenService.create(userId, userAgent);
      expect(result).toMatchObject({
        refreshToken: expect.any(String),
        accessToken: expect.any(String),
      });
    });

    it('should remove record, if tokens for current userId and userAgent exist', async () => {
      await tokenService.create(
        testToken.userId.toString(),
        testToken.userAgent,
      );
      const oldRecord = await tokenModel.findById(testToken._id).lean();
      expect(oldRecord).toBeNull();
    });

    it('should generate new tokens', async () => {
      const firstAttempt = await tokenService.create(
        testToken.userId.toString(),
        testToken.userAgent,
      );
      const secondAttempt = await tokenService.create(
        testToken.userId.toString(),
        testToken.userAgent,
      );
      expect(firstAttempt.accessToken).not.toEqual(secondAttempt.accessToken);
      expect(firstAttempt.refreshToken).not.toEqual(secondAttempt.refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('should return payload object from access token', async () => {
      const payload = { id: 'some_id' };
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);
      const result = await tokenService.verifyAccessToken('token');
      expect(result).toMatchObject(payload);
    });

    it('should throw Error if token is not valid', async () => {
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('token is not valid'));

      await expect(tokenService.verifyAccessToken('token')).rejects.toThrow();
    });
  });

  describe('updateRefreshToken', () => {
    it('should return new tokens', async () => {
      const result = await tokenService.updateRefreshToken(
        testToken.refreshToken,
        testToken.userAgent,
      );
      expect(result).toMatchObject({
        refreshToken: expect.any(String),
        accessToken: expect.any(String),
      });
      expect(result.refreshToken).not.toBe(testToken.refreshToken);
    });

    it('should return null if refreshToken does not exist in DB', async () => {
      const refresh = 'some-refresh';
      const result = await tokenService.updateRefreshToken(
        refresh,
        testToken.userAgent,
      );
      expect(result).toBeNull();
    });

    it('should return null if refreshToken have been expired', async () => {
      const userId = new mongoose.Types.ObjectId();
      const refreshToken = await randomBytes(16).toString('hex');
      const expires = DateTime.now().plus({ days: -1 });
      const userAgent = 'Mozilla Firefox 3.0';
      const token = await tokenModel.create({
        userId,
        refreshToken,
        expires,
        userAgent,
      });

      const result = await tokenService.updateRefreshToken(
        token.refreshToken,
        token.userAgent,
      );
      expect(result).toBeNull();
    });
  });

  describe('removeRefreshToken', () => {
    it('should remove refresh token', async () => {
      await tokenService.removeRefreshToken(
        testToken.userId.toString(),
        testToken.userAgent,
      );
      const token = await tokenModel.findById(testToken._id);
      expect(token).toBeNull();
    });
  });
});
