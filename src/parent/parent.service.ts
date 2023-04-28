import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent } from './schemas/parent.schema';

@Injectable()
export class ParentService {
  constructor(@InjectModel(Parent.name) private parentModel: Model<Parent>) {}

  async create(body: CreateParentDto, userId: string) {
    const existParent = await this.parentModel.findById(userId);
    if (existParent) {
      if (!existParent.isDeleted) {
        throw new Error('You have already registered as parent');
      }
      return this.parentModel.findByIdAndUpdate(
        userId,
        { ...body, isDeleted: false },
        { new: true },
      );
    }
    return this.parentModel.create({ ...body, _id: userId });
  }

  async findOne(parentId: string) {
    return this.parentModel
      .findOne({ _id: parentId, isDeleted: false })
      .populate('children');
  }

  async update(parentId: string, updateParentDto: UpdateParentDto) {
    return this.parentModel.findByIdAndUpdate(parentId, updateParentDto, {
      new: true,
    });
  }

  async remove(parentId: string) {
    return this.parentModel.findByIdAndUpdate(parentId, {
      isDeleted: true,
    });
  }
}
