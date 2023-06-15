import { createNannyDto } from 'src/nanny/stubs/nanny.stub';
import { createId } from 'src/test-utils/helpers/createId';
import { CreateHireDto } from '../dto/create-hire.dto';
import { DateTime, Info } from 'luxon';
import { NannyDocument } from 'src/nanny/schemas/nanny.schema';
import { IChild } from 'src/child/interfaces/IChild.interface';
import { Gender } from 'src/common/enums/gender.enum';

export const generateCreateHireDto = () => {
  const childFirstId = createId();
  const childSecondId = createId();
  const nannyId = createId();
  const userId = createId();

  const date = DateTime.now().plus({ day: 2 }).toJSDate();

  const createHireDto: CreateHireDto = {
    children: [childFirstId, childSecondId],
    date,
    nanny: nannyId,
  };

  return { createHireDto, userId };
};

const workdaysInfo = Info.weekdays('long', { locale: 'en' }).map((el) =>
  el.toLowerCase(),
);

export const generateNannyDto = (
  id: string,
  activeDays: boolean,
  groupSize = 3,
  childMaxAge = 10,
  childMinAge = 1,
): NannyDocument => {
  const workdays = workdaysInfo.reduce(
    (acc, el) => ({ ...acc, [el]: activeDays }),
    {},
  );
  return {
    id,
    firstName: 'Blase',
    lastName: 'Some',
    birthday: new Date(),
    groupSize,
    childMaxAge,
    childMinAge,
    dailyRate: 120,
    workdays,
  } as NannyDocument;
};
const generateRandomAge = () => {
  return Math.floor(Math.random() * 8) + 2;
};
export const generateChildDto = (id, parentId): IChild => ({
  id,
  name: 'some',
  birthday: new Date(),
  age: generateRandomAge(),
  gender: Gender.Male,
  parent: parentId,
});
