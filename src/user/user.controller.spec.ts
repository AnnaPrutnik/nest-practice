import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PasswordService } from './password.service';
import { usersStub } from './stubs/user.stub';

import { User, UserSchema, UserDocument } from './schemas/user.schema';
import { Request } from 'express';

jest.mock('./user.service');
jest.mock('./password.service');

describe('UsersController', () => {
  let controller: UserController;

  const requestMock = {
    query: {},
    body: {},
  } as unknown as Request;

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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers method', () => {
    let getAllUsers: {
      page: number;
      pages: number;
      total: number;
      users: UserDocument[];
    };

    let limit: number;
    let page: number;

    beforeEach(async () => {
      requestMock.query.limit = '5';
      requestMock.query.page = '1';
      limit = Number(requestMock.query.limit);
      page = Number(requestMock.query.page);
      getAllUsers = await controller.getAllUsers(limit, page);
    });

    it('should limit and page be defined', () => {
      expect(limit).not.toBeUndefined();
      expect(page).not.toBeUndefined();
    });

    it('should return success without query params', async () => {
      const result = usersStub();
      expect(getAllUsers).toEqual(result);
    });

    it('should return success with query params', async () => {});

    it('should return ', async () => {});
  });
});
