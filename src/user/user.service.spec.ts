import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  connectDB,
  dropDB,
  dropCollections,
} from 'src/test-utils/mongo/MongooseTestModule';
import { UserController } from './user.controller';
import { PasswordService } from './password.service';
import { usersForDB, testPassword } from './stubs/user.stub';
import { UserSchema, UserDocument, User } from './schemas/user.schema';
import { UserService } from './user.service';

import { Role } from 'src/common/enums/role.enum';

jest.mock('./password.service.ts');

describe('UserService', () => {
  let userService: UserService;
  let passwordService: PasswordService;
  let mongoUri: string;
  let testUser: UserDocument;

  beforeAll(async () => {
    mongoUri = await connectDB();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [UserController],
      providers: [UserService, PasswordService],
    }).compile();

    userService = module.get<UserService>(UserService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    for (const index in usersForDB) {
      await userService.create(usersForDB[index]);
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

    it('should return the new users data', async () => {
      const createdUser = await userService.create(newUser);
      expect(createdUser.email).toEqual(newUser.email);
      expect(createdUser.role).toEqual(newUser.role);
    });

    it('should create default role as parent', async () => {
      delete newUser.role;
      const createdUser = await userService.create(newUser);
      expect(createdUser.role).toBe(Role.Parent);
    });

    it('should return hashedPassword', async () => {
      const createdUser = await userService.create(newUser);
      const hashMethod = jest.spyOn(passwordService, 'hashPassword');
      expect(hashMethod).toBeCalled();
      expect(createdUser.password).not.toBe(newUser.password);
    });

    it('should throw an Error if email have been already used', async () => {
      await userService.create(newUser);
      await expect(userService.create(newUser)).rejects.toThrow(
        `E11000 duplicate key error collection: test.users index: email_1 dup key: { email: \"${newUser.email}\" }`,
      );
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

    it('should return total users equal 3', async () => {
      expect(result).toHaveProperty('total');
      expect(result.total).toBe(3);
    });
  });

  describe('getById', () => {
    it('should return user with the same id', async () => {
      const user = await userService.getById(testUser.id);
      expect(user.id).toEqual(testUser.id);
    });

    it('should return user without password', async () => {
      const user = await userService.getById(testUser.id);
      expect(user.password).toBeUndefined();
    });

    it('should return NotFoundException if user not exist', async () => {
      const randomId = new mongoose.Types.ObjectId();
      await expect(
        userService.getById(randomId.toString()),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('getByEmail', () => {
    it('should return user with the same id', async () => {
      const user = await userService.getByEmail(testUser.email);

      expect(user.email).toEqual(testUser.email);
    });

    it('should return NotFoundException if user not exist', async () => {
      const someEmail = 'blabla@mail.com';
      await expect(userService.getByEmail(someEmail)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('updateRole', () => {
    it('should update only Role', async () => {
      const newRole = Role.Admin;
      const updatedUser = await userService.updateRole(testUser.id, newRole);
      expect(updatedUser.role).toBe(newRole);
      expect(updatedUser.id).toBe(testUser.id);
      expect(updatedUser.email).toBe(testUser.email);
    });

    it('should not return a user password', async () => {
      const newRole = Role.Admin;
      const updatedUser = await userService.updateRole(testUser.id, newRole);
      expect(updatedUser.password).toBeUndefined();
    });

    it('should return NotFoundException if user is not exist', async () => {
      const newRole = Role.Admin;
      const someId = new mongoose.Types.ObjectId();
      await expect(
        userService.updateRole(someId.toString(), newRole),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should return BadRequestException if role is not valid', async () => {
      const notExistedRole = 'role';
      await expect(
        userService.updateRole(testUser.id, notExistedRole),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('update password', () => {
    const newPassword = 'newpass';
    it('should return string Success after changing password', async () => {
      const result = await userService.updatePassword(testUser.id, newPassword);
      expect(result).toBe('Success');
    });

    it('should return NotFoundException if user is not exist', async () => {
      const randomId = new mongoose.Types.ObjectId();
      await expect(
        userService.updatePassword(randomId.toString(), newPassword),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should return BadRequestException if new password the same as old', async () => {
      await expect(
        userService.updatePassword(testUser.id, testPassword),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
