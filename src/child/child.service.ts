import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { Child, ChildDocument } from './schemas/child.schema';

import { DateTime } from 'luxon';

@Injectable()
export class ChildService {
  constructor(@InjectModel(Child.name) private childModel: Model<Child>) {}

  getAge(birthday: Date) {
    const now = DateTime.now();
    const convertBirthday = DateTime.fromJSDate(birthday);
    const age = now.diff(convertBirthday, ['years', 'months']).toObject();
    return age.years;
  }

  private transformChildResponse(childDoc: ChildDocument) {
    const { isDeleted, ...child } = childDoc.toObject();
    return { ...child, age: this.getAge(child.birthday) };
  }

  async create(body: CreateChildDto, userId: string) {
    const children = await this.childModel.find({ parent: userId }).lean();
    if (children) {
      const existedChild = children.find(
        (child) => child.name === body.name && child.gender === body.gender,
      );
      if (existedChild) {
        const existedChildBirthday = DateTime.fromJSDate(existedChild.birthday);
        const newChildBirthday = DateTime.fromJSDate(body.birthday);
        const isTheSameDate = existedChildBirthday.diff(newChildBirthday, [
          'year',
          'month',
          'day',
        ]);

        if (isTheSameDate && !existedChild.isDeleted) {
          throw new BadRequestException('Child has been already registered');
        }

        if (isTheSameDate && existedChild.isDeleted) {
          const child = await this.childModel.findByIdAndUpdate(
            existedChild._id,
            { ...body, isDeleted: false },
            { new: true },
          );
          return this.transformChildResponse(child);
        }
      }
    }
    const child = await this.childModel.create({ ...body, parent: userId });
    return this.transformChildResponse(child);
  }

  async findChildrenByParent(parentId: string) {
    const children = await this.childModel.find({
      parent: parentId,
      isDeleted: false,
    });

    return children
      ? children.map((child) => this.transformChildResponse(child))
      : [];
  }

  async findOneChild(childId: string, parentId: string) {
    const child = await this.childModel.findOne({
      _id: childId,
      parent: parentId,
      isDeleted: false,
    });

    return child ? this.transformChildResponse(child) : null;
  }

  async findById(childId: string) {
    const child = await this.childModel.findOne({
      _id: childId,
      isDeleted: false,
    });
    return child ? this.transformChildResponse(child) : null;
  }

  async update(
    childId: string,
    parentId: string,
    updateChildDto: UpdateChildDto,
  ) {
    const updatedChild = await this.childModel.findOneAndUpdate(
      { _id: childId, parent: parentId },
      updateChildDto,
      {
        new: true,
      },
    );

    if (!updatedChild) {
      throw new BadRequestException(`No child with id ${childId}`);
    }
    return this.transformChildResponse(updatedChild);
  }

  async remove(childId: string, parentId: string) {
    const child = await this.childModel.findOneAndUpdate(
      { _id: childId, parent: parentId },
      { isDeleted: true },
    );
    if (!child) {
      throw new BadRequestException(`No child with id ${childId}`);
    }
    return;
  }
}
