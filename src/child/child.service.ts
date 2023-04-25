import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Child } from './schemas/child.schema';
import * as moment from 'moment';

@Injectable()
export class ChildService {
  constructor(@InjectModel(Child.name) private childModel: Model<Child>) {}

  getAge(birthday) {
    return moment().diff(birthday, 'years');
  }

  async create(body: CreateChildDto, userId: string) {
    const children = await this.childModel.find({ parent: userId }).lean();
    if (children) {
      const existedChild = children.find(
        (child) => child.name === body.name && child.gender === body.gender,
      );
      const isTheSameDate = moment(existedChild?.birthday).isSame(
        moment(body.birthday),
        'date',
      );
      if (isTheSameDate && existedChild.isDeleted) {
        return this.childModel.findByIdAndUpdate(
          existedChild._id,
          { ...body, isDeleted: false },
          { new: true },
        );
      }
      if (isTheSameDate && !existedChild.isDeleted) {
        throw new Error('Child has been already registered');
      }
    }
    return this.childModel.create({ ...body, parent: userId });
  }

  async findOneParentChildren(parentId: string) {
    return this.childModel.find({ parent: parentId, isDeleted: false });
  }

  async findOneChild(childId: string, parentId: string) {
    return this.childModel.findOne({
      _id: childId,
      parent: parentId,
      isDeleted: false,
    });
  }

  async findById(childId: string) {
    return this.childModel.findOne({ _id: childId, isDeleted: false });
  }

  async update(
    childId: string,
    parentId: string,
    updateChildDto: UpdateChildDto,
  ) {
    return this.childModel.findOneAndUpdate(
      { _id: childId, parent: parentId },
      updateChildDto,
      {
        new: true,
      },
    );
  }

  async remove(childId: string, parentId: string) {
    return this.childModel.findOneAndUpdate(
      { _id: childId, parent: parentId },
      { isDeleted: true },
    );
  }
}
