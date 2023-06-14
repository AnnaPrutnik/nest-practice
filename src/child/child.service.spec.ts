import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChildService } from './child.service';
import { ChildController } from './child.controller';
import { Child, ChildSchema } from './schemas/child.schema';

import {
  connectDB,
  dropDB,
  dropCollections,
} from 'src/test-utils/mongo/MongooseTestModule';
import { createChildDto, userId } from './stubs/child.stub';
import { Gender } from 'src/common/enums/gender.enum';

describe('ChildService', () => {
  let childService: ChildService;
  let childModel: mongoose.Model<Child>;
  let mongoUri: string;
  let testChild;

  beforeAll(async () => {
    mongoUri = await connectDB();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
      ],
      controllers: [ChildController],
      providers: [ChildService],
    }).compile();

    childService = module.get<ChildService>(ChildService);
    childModel = module.get<mongoose.Model<Child>>(getModelToken(Child.name));
  });

  beforeEach(async () => {
    // jest.clearAllMocks();
    testChild = await childService.create(createChildDto, userId.toString());
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await dropDB();
  });

  it('should be defined', () => {
    expect(childService).toBeDefined();
  });

  describe('getAge', () => {
    it('should return age', () => {
      const birthDay = new Date('2016-05-03');
      const result = childService.getAge(birthDay);
      expect(result).toBe(7);
    });

    describe('create', () => {
      const newChild = {
        name: 'Vicky',
        birthday: new Date('2020-03-25'),
        gender: Gender.Female,
      };

      it('should return new child', async () => {
        const result = await childService.create(newChild, userId.toString());
        expect(result.name).toBe(newChild.name);
        expect(result.birthday).toEqual(newChild.birthday);
        expect(result.gender).toBe(newChild.gender);
        expect(result.parent).toEqual(userId);
      });

      it('should create new record to db', async () => {
        await childService.create(newChild, userId.toString());

        const db = await childModel.find({});
        expect(db.length).toBe(2);
      });

      it('should return BadRequestException if create the same child', async () => {
        await expect(
          childService.create(testChild, userId.toString()),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('should return new child if children have the same name', async () => {
        const child = {
          ...newChild,
          name: testChild.name,
        };

        const result = await childService.create(child, userId.toString());
        expect(result.name).toBe(child.name);
      });
    });

    describe('findChildrenByParent', () => {
      it('should return children of one parent', async () => {
        const children = await childService.findChildrenByParent(
          userId.toString(),
        );
        expect(children.length).toBe(1);
        expect(children).toBeInstanceOf(Array);
      });

      it('should return empty array if parent has not children', async () => {
        const id = new mongoose.Types.ObjectId();
        const children = await childService.findChildrenByParent(id.toString());
        expect(children.length).toBe(0);
      });
    });

    describe('findOneChild', () => {
      it('should return child for current parent', async () => {
        const child = await childService.findOneChild(
          testChild.id,
          userId.toString(),
        );

        expect(child.name).toBe(testChild.name);
        expect(child.gender).toBe(testChild.gender);
        expect(child.birthday).toEqual(testChild.birthday);
        expect(child.parent).toEqual(userId);
      });

      it('should return null if parent has not the child with such id', async () => {
        const childId = new mongoose.Types.ObjectId();
        const result = await childService.findOneChild(
          childId.toString(),
          userId.toString(),
        );
        expect(result).toBeNull();
      });
    });

    describe('findById', () => {
      it('should return child ', async () => {
        const child = await childService.findById(testChild.id);

        expect(child.name).toBe(testChild.name);
        expect(child.gender).toBe(testChild.gender);
        expect(child.birthday).toEqual(testChild.birthday);
        expect(child.parent).toEqual(userId);
      });

      it('should return null if there is no child with such id', async () => {
        const childId = new mongoose.Types.ObjectId();
        const result = await childService.findById(childId.toString());
        expect(result).toBeNull();
      });
    });

    describe('update', () => {
      const body = {
        name: 'William',
      };
      it('should return updated child', async () => {
        const updatedChild = await childService.update(
          testChild.id,
          userId.toString(),
          body,
        );
        expect(updatedChild.name).toBe(body.name);
        expect(updatedChild.name).not.toBe(testChild.name);
      });

      it('should not change other data except data in body', async () => {
        const updatedChild = await childService.update(
          testChild.id,
          userId.toString(),
          body,
        );
        expect(updatedChild.gender).toBe(testChild.gender);
        expect(updatedChild.birthday).toEqual(testChild.birthday);
        expect(updatedChild.parent).toEqual(userId);
      });

      // it('should return BadRequestException if there are validation error', async () => {
      //   const body = {
      //     body: 'something',
      //     birthday: '2017-05-26',
      //   };

      //   await expect(
      //     childService.update(testChild.id, userId.toString(), body),
      //   );
      // });

      it('should return BadRequestException if child with current id is not existed', async () => {
        const id = new mongoose.Types.ObjectId();

        await expect(
          childService.update(id.toString(), userId.toString(), body),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('should return BadRequestException if parent id is not match', async () => {
        const id = new mongoose.Types.ObjectId();

        await expect(
          childService.update(testChild.id, id.toString(), body),
        ).rejects.toBeInstanceOf(BadRequestException);
      });
    });

    describe('remove', () => {
      it('should remove child', async () => {
        await childService.remove(testChild.id, userId.toString());
        const child = await childModel.findById(testChild.id);
        expect(child.isDeleted).toBeTruthy();
      });

      it('should throw BadRequestException if child with current id is not existed', async () => {
        const id = new mongoose.Types.ObjectId();

        await expect(
          childService.remove(id.toString(), userId.toString()),
        ).rejects.toBeInstanceOf(BadRequestException);
      });

      it('should return BadRequestException if parent id is not match', async () => {
        const id = new mongoose.Types.ObjectId();

        await expect(
          childService.remove(testChild.id, id.toString()),
        ).rejects.toBeInstanceOf(BadRequestException);
      });
    });
  });
});
