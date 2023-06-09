import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PasswordService } from './password.service';
import { User, UserSchema } from './schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from 'src/common/enums/role.enum';

jest.mock('./user.service');
jest.mock('./password.service');

describe('UsersController', () => {
  let controller: UserController;
  let userService: UserService;

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
    it('should be called userService.getAllUsers with limit and page', async () => {
      const limit = 10;
      const page = 1;
      const userGetAll = jest.spyOn(userService, 'getAll');
      await controller.getAllUsers(limit, page);
      expect(userGetAll).toHaveBeenCalledTimes(1);
      expect(userGetAll).toHaveBeenCalledWith(limit, page);
    });
  });

  describe('getProfile', () => {
    it('should be called userService.getById', async () => {
      const id = 'id';
      const userGetById = jest.spyOn(userService, 'getById');
      await controller.getUser(id);

      expect(userGetById).toBeCalledTimes(1);
      expect(userGetById).toBeCalledWith(id);
    });
  });

  describe('updateRole', () => {
    it('should be called userService.updateRole', async () => {
      const body = { role: Role.Parent };
      const id = 'id';
      const userUpdateRole = jest.spyOn(userService, 'updateRole');
      await controller.changeRole(body, id);

      expect(userUpdateRole).toBeCalledTimes(1);
      expect(userUpdateRole).toBeCalledWith(id, body.role);
    });
  });

  describe('updatePassword', () => {
    it('should called UserService.updatePassword', async () => {
      const body = { password: '12345' };
      const reqUser = {
        id: 'id',
        role: Role.Admin,
      };
      const userUpdatePassword = jest.spyOn(userService, 'updatePassword');
      await controller.changePassword(body, reqUser);
      expect(userUpdatePassword).toBeCalledTimes(1);
      expect(userUpdatePassword).toBeCalledWith(reqUser.id, body.password);
    });
  });
});
