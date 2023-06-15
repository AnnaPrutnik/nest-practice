import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Nanny, NannySchema } from './schemas/nanny.schema';
import { NannyService } from './nanny.service';
import { NannyController } from './nanny.controller';
import { createNannyDto, userId } from './stubs/nanny.stub';
import {
  connectDB,
  dropDB,
  dropCollections,
} from 'src/test-utils/mongo/MongooseTestModule';
import { createId } from 'src/test-utils/helpers/createId';

describe('NannyService', () => {
  let nannyService: NannyService;
  let mongoUri: string;
  let testNanny;

  beforeAll(async () => {
    mongoUri = await connectDB();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: Nanny.name, schema: NannySchema }]),
      ],
      controllers: [NannyController],
      providers: [NannyService],
    }).compile();

    nannyService = module.get<NannyService>(NannyService);
  });

  beforeEach(async () => {
    testNanny = await nannyService.create(createNannyDto, userId);
  });

  afterEach(async () => {
    await dropCollections();
  });

  afterAll(async () => {
    await dropDB();
  });

  it('should be defined', () => {
    expect(nannyService).toBeDefined();
  });

  describe('create', () => {
    const newNanny = {
      firstName: 'Bonny',
      lastName: 'Klaus',
      birthday: new Date('1993-01-01'),
      childMinAge: 1,
      childMaxAge: 5,
      groupSize: 3,
      dailyRate: 350,
      workdays: {
        monday: true,
        tuesday: false,
        wednesday: false,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: false,
      },
    };
    const userId = createId();
    it('should return created nanny', async () => {
      const nanny = await nannyService.create(newNanny, userId);
      expect(nanny).toMatchObject(newNanny);
    });

    it('should thrown BadRequestException if nanny have been already created', async () => {
      await nannyService.create(newNanny, userId);
      await expect(
        nannyService.create(newNanny, userId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should not create a new nanny if she/he had been created and then have been removed', async () => {
      const id = testNanny.id;
      await nannyService.remove(id);
      const nanny = await nannyService.create(createNannyDto, id);
      expect(nanny.id).toBe(id);
    });
  });

  describe('findAll', () => {
    it('should return list of nannies', async () => {
      const response = await nannyService.findAll(10, 1);
      expect(response).toHaveProperty('nannies');
      expect(response.nannies.length).toBe(1);
    });

    it('should return empty array if there are no nannies in db', async () => {
      await nannyService.remove(testNanny.id);
      const result = await nannyService.findAll(10, 1);
      expect(result.nannies.length).toBe(0);
    });

    it('should return result with pagination', async () => {
      const response = await nannyService.findAll(10, 1);

      expect(response).toHaveProperty('total', 1);
      expect(response).toHaveProperty('pages', 1);
      expect(response).toHaveProperty('page', 1);
      expect(response).toHaveProperty('limit', 10);
    });
  });

  describe('findOne', () => {
    it('should return nanny', async () => {
      const nanny = await nannyService.findOne(testNanny.id);
      expect(nanny).toMatchObject(testNanny);
    });

    it('should return null if there is no user with current id', async () => {
      const id = createId();
      const nanny = await nannyService.findOne(id);
      expect(nanny).toBeNull();
    });
  });

  describe('update', () => {
    const body = {
      groupSize: 10,
      dailyRate: 250,
    };
    it('should return updated nanny', async () => {
      const nanny = await nannyService.update(testNanny.id, body);

      expect(nanny.groupSize).toBe(body.groupSize);
      expect(nanny.dailyRate).toBe(body.dailyRate);
      expect(nanny.groupSize).not.toBe(testNanny.groupSize);
      expect(nanny.dailyRate).not.toBe(testNanny.dailyRate);
      expect(nanny.firstName).toBe(testNanny.firstName);
      expect(nanny.childMaxAge).toBe(testNanny.childMaxAge);
    });

    it('should update workdays', async () => {
      const { wednesday, ...otherOldDays } = testNanny.workdays;
      const newBody = {
        workdays: {
          wednesday: !wednesday,
        },
      };

      const updatedNanny = await nannyService.update(testNanny.id, newBody);

      const { wednesday: newWednesday, ...otherNewDays } =
        updatedNanny.toObject().workdays;

      expect(newWednesday).toBe(newBody.workdays.wednesday);
      expect(newWednesday).not.toBe(testNanny.workdays.wednesday);
      expect(otherNewDays).toEqual(otherOldDays);
    });

    it('should return NotFoundException if there is no user with current id', async () => {
      const id = createId();
      await expect(nannyService.update(id, body)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove nanny', async () => {
      await nannyService.remove(testNanny.id);
      const nanny = await nannyService.findOne(testNanny.id);
      expect(nanny).toBeNull();
    });

    it('should return NotFoundException if there is no user with current id', async () => {
      const id = createId();

      await expect(nannyService.remove(id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
