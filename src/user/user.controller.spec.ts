import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PasswordService } from './password.service';
import { userStub, usersStub } from './stubs/user.stub';
import { User, UserSchema, UserDocument } from './schemas/user.schema';
import { Role } from 'src/common/enums/role.enum';
import { getModelToken } from '@nestjs/mongoose';

jest.mock('./user.service');
jest.mock('./password.service');

describe('UsersController', () => {
  let controller: UserController;
  let userService: UserService;

  const userId = userStub().id;
  const userProfile = userStub();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PasswordService,
        { provide: getModelToken(User.name), useValue: UserSchema },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    let getAllUsers: {
      page: number;
      pages: number;
      total: number;
      users: UserDocument[];
    };

    beforeEach(async () => {
      getAllUsers = await controller.getAllUsers(10, 1);
    });

    it('should be called userService.getAllUsers with limit and page', async () => {
      expect(userService.getAll).toHaveBeenCalledTimes(1);
      expect(userService.getAll).toHaveBeenCalledWith(10, 1);
    });

    it('should return list of users', async () => {
      const result = usersStub();
      expect(getAllUsers).toEqual(result);
    });
  });

  describe('getProfile', () => {
    it('should be called userService.getById', async () => {
      await controller.getUser(userId);

      expect(userService.getById).toBeCalledTimes(1);
      expect(userService.getById).toBeCalledWith(userId);
    });

    it('should return a user profile', async () => {
      const result = await controller.getUser(userId);

      expect(result).toEqual(userProfile);
    });

    it('should be throw an NotFoundException without user profile', async () => {
      try {
        await controller.getUser('not id');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('changeRole', () => {
    const body = { role: Role.Parent };
    it('should be called userService.updateRole', async () => {
      await controller.changeRole(body, userId);

      expect(userService.updateRole).toBeCalledTimes(1);
      expect(userService.updateRole).toBeCalledWith(userId, body.role);
    });

    it('should return updated role', async () => {
      const updatedUser = await controller.changeRole(body, userId);
      expect(updatedUser.role).toBe(body.role);
    });

    it('should return NotFoundException without user data', async () => {
      try {
        await controller.changeRole(body, 'other-id');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('updatePassword', () => {
    const body = { password: '12345' };
    const reqUser = {
      id: userId,
      role: userProfile.role,
    };

    it('should called UserService.updatePassword', async () => {
      await controller.changePassword(body, reqUser);

      expect(userService.updatePassword).toBeCalledTimes(1);
      expect(userService.updatePassword).toBeCalledWith(
        reqUser.id,
        body.password,
      );
    });

    it('should return string after success changing', async () => {
      const result = await controller.changePassword(body, reqUser);

      expect(typeof result).toBe('string');
    });

    it('should thrown a BadRequestException if password is the same', async () => {
      const body = { password: userProfile.password };
      try {
        await controller.changePassword(body, reqUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
