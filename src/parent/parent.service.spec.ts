import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';

import { ParentController } from './parent.controller';
import { CreateParentDto } from './dto/create-parent.dto';

import { Parent, ParentSchema } from './schemas/parent.schema';
import { ChildService } from 'src/child/child.service';
import {
  connectDB,
  dropDB,
  dropCollections,
} from 'src/test-utils/mongo/MongooseTestModule';
import { ParentService } from './parent.service';
import { createParentDto, userId } from './stubs/parent.stub';
import { createId } from 'src/test-utils/helpers/createId';

jest.mock('src/child/child.service');
const childId = createId();

function mockFindChildrenByParent(id: string) {
  return [
    {
      id: childId,
      name: 'Lizzy',
      birthday: new Date('1986-02-15'),
      parent: id,
    },
  ];
}
describe('ParentService', () => {
  let parentService: ParentService;
  let mongoUri: string;
  let testParent;

  beforeAll(async () => {
    mongoUri = await connectDB();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([
          { name: Parent.name, schema: ParentSchema },
        ]),
      ],
      controllers: [ParentController],
      providers: [
        {
          provide: ChildService,
          useValue: {
            findChildrenByParent: jest
              .fn()
              .mockImplementation(mockFindChildrenByParent),
          },
        },
        ParentService,
      ],
    }).compile();

    parentService = module.get<ParentService>(ParentService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    testParent = await parentService.create(createParentDto, userId);
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await dropDB();
  });

  it('should be defined', () => {
    expect(parentService).toBeDefined();
  });

  describe('create', () => {
    let newParent: CreateParentDto;
    let userId: string;

    beforeEach(() => {
      newParent = {
        firstName: 'Penny',
        lastName: 'Smith',
        birthday: new Date('1990-05-22'),
      };
      userId = createId();
    });

    it('should return created parent', async () => {
      const parent = await parentService.create(newParent, userId);
      expect(parent.firstName).toBe(newParent.firstName);
      expect(parent.lastName).toBe(newParent.lastName);
      expect(parent.birthday).toEqual(newParent.birthday);
    });

    it('should return BadRequest if parent have een already exist', async () => {
      await parentService.create(newParent, userId);
      await expect(
        parentService.create(newParent, userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return parent', async () => {
      const parent = await parentService.findOne(userId);

      expect(parent).toEqual(testParent);
    });

    it('should return null if no parent', async () => {
      const id = createId();
      const parent = await parentService.findOne(id);
      expect(parent).toBeNull;
    });
  });

  describe('update', () => {
    const body = {
      firstName: 'Ketty',
    };
    it('should return updated parent', async () => {
      const parent = await parentService.update(userId, body);
      expect(parent.firstName).toBe(body.firstName);
    });

    it('should throw BadRequestException if no parent', async () => {
      const id = createId();

      await expect(parentService.update(id, body)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove parent', async () => {
      await parentService.remove(userId);
      const parent = await parentService.findOne(userId);
      expect(parent).toBeNull();
    });

    it('should throw BadRequestException if no parent', async () => {
      const id = createId();

      await expect(parentService.remove(id)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });
});
