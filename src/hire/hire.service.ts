import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateHireDto } from './dto/create-hire.dto';
import { UpdateHireDto } from './dto/update-hire.dto';
import { Hire } from './schemas/hire.schema';
import { ChildService } from 'src/child/child.service';
import { NannyService } from 'src/nanny/nanny.service';
import { NannyDocument } from 'src/nanny/schemas/nanny.schema';
import { Status } from 'src/common/enums/status.enum';
import * as moment from 'moment';

@Injectable()
export class HireService {
  constructor(
    @InjectModel(Hire.name) private hireModel: Model<Hire>,
    private childService: ChildService,
    private nannyService: NannyService,
  ) {}

  private verifyDate(date: Date) {
    const isFutureDate = moment().isBefore(date);
    if (!isFutureDate) {
      throw new Error('The date must be in the future');
    }
    return isFutureDate;
  }

  private async checkNannyAvailability(nannyId: string, date: Date) {
    //check is such nanny exist
    const nanny = await this.nannyService.findOne(nannyId);
    if (!nanny) {
      throw new Error('No such nanny');
    }
    //check has nanny already hired on that day
    const isScheduledDay = await this.hireModel.findOne({
      nanny: nannyId,
      date: date,
    });
    if (isScheduledDay) {
      throw new Error('This day is not available');
    }
    //check the working date in nanny schedule
    const weekday = moment(date).format('dddd');
    const isAvailableDay = nanny.workdays[weekday.toLowerCase()];
    if (!isAvailableDay) {
      throw new Error(`The nanny is not working on ${weekday}`);
    }
    return nanny;
  }

  private getMonthPeriod(month) {
    const isNumber = moment(month, 'M MM').isValid();
    const monthSign = isNumber ? 'M MM' : 'MMM MMMM';
    const start = moment(month, monthSign).startOf('month');
    const end = moment(month, monthSign).endOf('month');
    return { start, end };
  }

  private async verifyChildren(
    nanny: NannyDocument,
    children: string[],
    parentId: string,
  ) {
    //check children group
    const childGroup = children.length;
    if (childGroup > nanny.groupSize) {
      throw new Error(
        `The group of children cannot exceed ${nanny.groupSize} kids.`,
      );
    }
    //check is own children and also is children have acceptable age for nanny
    const ownChildren = await this.childService.findChildrenByParent(parentId);
    const validateAgeRange = children.every((child) => {
      const ownChild = ownChildren.find((ownChild) => ownChild.id === child);
      if (!ownChild) {
        return false;
      }
      const age = this.childService.getAge(ownChild.birthday);
      return age <= nanny.childMaxAge && age >= nanny.childMinAge;
    });
    if (!validateAgeRange) {
      throw new Error(
        'One or more children do not match the parent or do not meet the age requirements of the nanny. Please double-check the children array.',
      );
    }
  }

  async create(body: CreateHireDto, parentId: string) {
    //verify date
    this.verifyDate(body.date);
    //check nanny
    const nanny = await this.checkNannyAvailability(body.nanny, body.date);
    //verify children
    await this.verifyChildren(nanny, body.children, parentId);
    return this.hireModel.create({ ...body, parent: parentId });
  }

  getOne(hireId: string) {
    return this.hireModel
      .findById(hireId)
      .populate('nanny', 'firstName birthday')
      .populate('parent', 'firstName')
      .populate('children', 'name, age')
      .exec();
  }

  async update(hireId: string, updateHireDto: UpdateHireDto) {
    //check does hire complete or cancel or not exist
    const hire = await this.hireModel.findById(hireId);
    if (
      !hire ||
      hire.status === Status.Completed ||
      hire.status === Status.Canceled
    ) {
      throw new Error('Hire is not available');
    }
    //check date
    let nanny: NannyDocument;
    if (updateHireDto.hasOwnProperty('date')) {
      this.verifyDate(updateHireDto.date);
      nanny = await this.checkNannyAvailability(
        hire.nanny.toString(),
        updateHireDto.date,
      );
    } else {
      nanny = await this.nannyService.findOne(hire.nanny.toString());
    }
    //check children
    if (updateHireDto.hasOwnProperty('children')) {
      await this.verifyChildren(
        nanny,
        updateHireDto.children,
        hire.parent.toString(),
      );
    }

    return this.hireModel.findByIdAndUpdate(hireId, updateHireDto, {
      new: true,
    });
  }

  cancel(hireId: string) {
    return this.hireModel.findByIdAndUpdate(
      hireId,
      {
        status: Status.Canceled,
      },
      { new: true },
    );
  }

  close(hireId: string) {
    return this.hireModel.findByIdAndUpdate(
      hireId,
      {
        status: Status.Completed,
      },
      { new: true },
    );
  }

  async nannyMonthHire(
    nannyId: string,
    month: string,
    limit: number,
    page: number,
  ) {
    const { start, end } = this.getMonthPeriod(month);
    const skip = (page - 1) * limit;
    const data = await this.hireModel
      .find({
        nanny: nannyId,
        date: { $gte: start, $lte: end },
      })
      .limit(limit)
      .skip(skip);
    const total = await this.hireModel
      .find({
        nanny: nannyId,
        date: { $gte: start, $lte: end },
      })
      .count();
    const pages = Math.floor(total / limit);
    return { data, limit, page, pages, total };
  }
}
