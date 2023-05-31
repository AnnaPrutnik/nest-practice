import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';

import {
  connectDB,
  dropDB,
  dropCollections,
} from 'src/test-utils/mongo/MongooseTestModule';
import { UserController } from './user.controller';
import { PasswordService } from './password.service';
import { createUserDtoStub } from './stubs/user.stub';
import { UserSchema, UserDocument, User } from './schemas/user.schema';
import { UserService } from './user.service';
import mongoose from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

jest.mock('./password.service.ts');

describe('UserService', () => {
  let userService: UserService;
  let mongoUri: string;
  let testUser: UserDocument;

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

    const users = createUserDtoStub();
    for (const index in users) {
      await userService.create(users[index]);
    }
    const result = await userService.getAll(1, 1);
    testUser = result.users[0];
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
    const newUser = {
      email: 'email@mail.com',
      password: '123456',
      role: Role.Admin,
    };

    it('should return the saved object', async () => {
      const createdUser = await userService.create(newUser);
      expect(createdUser.email).toEqual(newUser.email);
    });

    it('should throw an Error if email have been already used', async () => {
      await userService.create(newUser);
      let result;
      let error;
      try {
        result = await userService.create(newUser);
      } catch (err) {
        error = err;
      } finally {
        expect(error.code).toBe(11000);
        expect(result).toBeUndefined();
      }
    });
  });

  describe('getAll', () => {
    let result;
    beforeEach(async () => {
      result = await userService.getAll(10, 1);
    });

    it('should return list of users', async () => {
      expect(result.users.length).toBe(3);
    });

    it('should return total users in result', async () => {
      expect(result).toHaveProperty('total');
      expect(result.total).toBe(3);
    });
  });

  describe('getById', () => {
    it('should return user with the same id', async () => {
      const user = await userService.getById(testUser.id);
      expect(user.id).toEqual(testUser.id);
    });

    it('should return NotFoundException if user not exist', async () => {
      const someId = new mongoose.Types.ObjectId();
      let result;
      let error;
      try {
        result = await userService.getById(someId.toString());
      } catch (err) {
        error = err;
      } finally {
        expect(result).toBeUndefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('getByEmail', () => {
    it('should return user with the same id', async () => {
      const user = await userService.getByEmail(testUser.email);

      expect(user.email).toEqual(testUser.email);
    });

    it('should return NotFoundException if user not exist', async () => {
      const someEmail = 'blabla@mail.com';
      let result;
      let error;
      try {
        result = await userService.getByEmail(someEmail);
      } catch (err) {
        error = err;
      } finally {
        expect(result).toBeUndefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updateRole', () => {
    it('should return new Role', async () => {
      const newRole = Role.Admin;
      const updatedUser = await userService.updateRole(testUser.id, newRole);
      expect(updatedUser.role).toBe(newRole);
    });

    it('should not return a user password', async () => {
      const newRole = Role.Admin;
      const updatedUser = await userService.updateRole(testUser.id, newRole);
      expect(updatedUser.password).toBeUndefined();
    });

    it('should return NotFoundException if user is not exist', async () => {
      const newRole = Role.Admin;
      const someId = new mongoose.Types.ObjectId();
      let result;
      let error;
      try {
        result = await userService.updateRole(someId.toString(), newRole);
      } catch (err) {
        error = err;
      } finally {
        expect(result).toBeUndefined();
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return NotFoundException if role is not valid', async () => {
      const notExistRole = 'role';
      let result;
      let error;
      try {
        result = await userService.updateRole(testUser.id, notExistRole);
      } catch (err) {
        error = err;
      } finally {
        expect(result).toBeUndefined();
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
