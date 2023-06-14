import { createId } from 'src/test-utils/helpers/createId';
import { CreateNannyDto } from '../dto/create-nanny.dto';

export const createNannyDto: CreateNannyDto = {
  firstName: 'Maria',
  lastName: 'Kluni',
  birthday: new Date('1995-06-17'),
  childMinAge: 2,
  childMaxAge: 10,
  groupSize: 5,
  dailyRate: 120,
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

export const userId = createId();
