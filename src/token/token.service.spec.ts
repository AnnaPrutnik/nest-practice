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
            signAsync: jest.fn(({ id }) => `Header.${id}.Signature`),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => {
              return null;
            }),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
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

    it('should return new pair for existed tokens for user', async () => {
      const existTokens = await tokenModel.findById(testToken._id);
      const newTokens = await tokenService.create(
        testToken.userId.toString(),
        testToken.userAgent,
      );
      expect(newTokens.refreshToken).not.toBe(existTokens.refreshToken);
    });

    it('should remove record, if token for pair of userId and userAgent exist', async () => {
      await tokenService.create(
        testToken.userId.toString(),
        testToken.userAgent,
      );
      const oldRecord = await tokenModel.findById(testToken._id).lean();
      expect(oldRecord).toBeNull();
    });
  });
});
