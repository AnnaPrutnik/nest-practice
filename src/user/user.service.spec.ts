import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import {
  connectDB,
  dropDB,
  dropCollections,
} from '../test-utils/mongo/MongooseTestModule';
import { UserController } from './user.controller';
import { PasswordService } from './password.service';
import { userStub, createUserDtoStub } from './stubs/user.stub';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

jest.mock('./password.service.ts');

describe('UserService', () => {
  let userService: UserService;
  let mongoUri: string;

  beforeAll(async () => {
    mongoUri = await connectDB();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      controllers: [UserController],
      providers: [UserService, PasswordService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await dropDB();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create user', () => {
    it('should return the saved object', async () => {
      const createdUser = await userService.create(createUserDtoStub());
      expect(createdUser.email).toEqual(userStub().email);
    });

    it('should throw an Error if email have been already used', async () => {
      try {
        await userService.create(createUserDtoStub());
      } catch (error) {
        console.log(error);
        expect(error.code).toBe(11000);
      }
    });
  });
});
