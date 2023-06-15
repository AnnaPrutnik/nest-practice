import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ChildService } from 'src/child/child.service';
import { NannyService } from 'src/nanny/nanny.service';
import { HireService } from './hire.service';
import { HireController } from './hire.controller';
import { DateTime } from 'luxon';

import { Hire, HireDocument, HireSchema } from './schemas/hire.schema';
import { Nanny, NannySchema } from 'src/nanny/schemas/nanny.schema';
import { Child, ChildSchema } from 'src/child/schemas/child.schema';
import { Parent, ParentSchema } from 'src/parent/schemas/parent.schema';
import {
  connectDB,
  dropDB,
  dropCollections,
} from 'src/test-utils/mongo/MongooseTestModule';
import {
  generateCreateHireDto,
  generateNannyDto,
  generateChildDto,
} from './stubs/hire.stub';
import { createId } from 'src/test-utils/helpers/createId';

jest.mock('src/child/child.service');
jest.mock('src/nanny/nanny.service');

describe('HireService', () => {
  let hireService: HireService;
  let nannyService: NannyService;
  let childService: ChildService;
  let mongoUri: string;
  let hireModel: mongoose.Model<Hire>;

  let testHire: HireDocument;

  beforeAll(async () => {
    mongoUri = await connectDB();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Hire.name, schema: HireSchema }]),
        MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
        MongooseModule.forFeature([
          { name: Parent.name, schema: ParentSchema },
        ]),
        MongooseModule.forFeature([{ name: Nanny.name, schema: NannySchema }]),
      ],
      controllers: [HireController],
      providers: [ChildService, NannyService, HireService],
    }).compile();

    hireService = module.get<HireService>(HireService);
    hireModel = module.get<mongoose.Model<Hire>>(getModelToken(Hire.name));

    nannyService = module.get<NannyService>(NannyService);
    childService = module.get<ChildService>(ChildService);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const { createHireDto, userId } = generateCreateHireDto();
    testHire = await hireModel.create({ ...createHireDto, parent: userId });
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await dropDB();
  });

  it('should be defined', () => {
    expect(hireService).toBeDefined();
  });

  describe('create', () => {
    const { createHireDto, userId } = generateCreateHireDto();
    const nanny = generateNannyDto(createHireDto.nanny, true);
    const children = createHireDto.children.map((child) =>
      generateChildDto(child, userId),
    );

    it('should return new hire with input data', async () => {
      jest.spyOn(nannyService, 'findOne').mockResolvedValueOnce(nanny);
      jest
        .spyOn(childService, 'findChildrenByParent')
        .mockResolvedValueOnce(children);

      const hire = await hireService.create(createHireDto, userId);

      expect(hire.parent.toString()).toEqual(userId);
      expect(hire.children.length).toBe(2);
      expect(hire.date).toEqual(createHireDto.date);
      expect(hire.nanny.toString()).toEqual(createHireDto.nanny);
    });

    it('should throw BadRequestException if date is today', async () => {
      const newCreateHireDto = {
        ...createHireDto,
        date: DateTime.now().toJSDate(),
      };

      await expect(
        hireService.create(newCreateHireDto, userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if date is before today', async () => {
      const newCreateHireDto = {
        ...createHireDto,
        date: DateTime.now().plus({ day: -1 }).toJSDate(),
      };

      await expect(
        hireService.create(newCreateHireDto, userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if nanny is not exist', async () => {
      jest.spyOn(nannyService, 'findOne').mockResolvedValueOnce(null);

      await expect(
        hireService.create(createHireDto, userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if nanny have already ordered this day', async () => {
      jest.spyOn(nannyService, 'findOne').mockResolvedValueOnce(nanny);

      const newCreateHireDto = {
        ...createHireDto,
        nanny: testHire.nanny.toString(),
      };

      await expect(
        hireService.create(newCreateHireDto, userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if nanny is not available this day', async () => {
      const nannyWithFalseWorkdays = generateNannyDto(
        createHireDto.nanny,
        false,
      );

      jest
        .spyOn(nannyService, 'findOne')
        .mockResolvedValueOnce(nannyWithFalseWorkdays);

      await expect(
        hireService.create(createHireDto, userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if number of children is more than group size at nanny profile', async () => {
      const nanny = generateNannyDto(createHireDto.nanny, true, 1);
      jest.spyOn(nannyService, 'findOne').mockResolvedValueOnce(nanny);

      await expect(
        hireService.create(createHireDto, userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException if children are not owned this parent', async () => {
      jest.spyOn(nannyService, 'findOne').mockResolvedValueOnce(nanny);
      const ownChild = generateChildDto(createId(), userId);

      jest
        .spyOn(childService, 'findChildrenByParent')
        .mockResolvedValueOnce([ownChild]);

      await expect(
        hireService.create(createHireDto, userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('getOne', () => {
    it('should return one hire', async () => {
      const hire = await hireService.getOne(testHire.id);

      expect(hire).toBeDefined();
      expect(hire.id).toEqual(testHire.id);
    });

    it('should throw NotFoundException if there is no hire with such id', async () => {
      const id = createId();
      await expect(hireService.getOne(id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updatedBody = {
      date: DateTime.now().plus({ day: 3 }).toJSDate(),
      children: [testHire.children[0] as Child],
    };

    const nanny = generateNannyDto(testHire.nanny.toString(), true);
    it('should return updated hire', async () => {
      jest.spyOn(nannyService, 'findOne').mockResolvedValueOnce(nanny);

      const result = await hireService.update(testHire.id, updatedBody);
    });
  });
});
