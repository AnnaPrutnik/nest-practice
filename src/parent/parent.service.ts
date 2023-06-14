import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent, ParentDocument } from './schemas/parent.schema';
import { ChildService } from 'src/child/child.service';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<Parent>,
    private childService: ChildService,
  ) {}

  private async addChildren(parentDoc: ParentDocument) {
    const children = await this.childService.findChildrenByParent(parentDoc.id);
    const { isDeleted, ...parent } = parentDoc.toObject();
    return { ...parent, children };
  }

  async create(body: CreateParentDto, userId: string) {
    const existParent = await this.parentModel.findById(userId);
    if (existParent) {
      if (!existParent.isDeleted) {
        throw new BadRequestException('You have already registered as parent');
      }
      const parent = await this.parentModel.findByIdAndUpdate(
        userId,
        { ...body, isDeleted: false },
        { new: true },
      );
      return this.addChildren(parent);
    }
    const parent = await this.parentModel.create({ ...body, _id: userId });
    return this.addChildren(parent);
  }

  async findOne(parentId: string) {
    const parent = await this.parentModel.findOne({
      _id: parentId,
      isDeleted: false,
    });
    if (!parent) {
      return null;
    }
    return this.addChildren(parent);
  }

  async update(parentId: string, updateParentDto: UpdateParentDto) {
    const parent = await this.parentModel.findOneAndUpdate(
      { _id: parentId, isDeleted: false },
      updateParentDto,
      {
        new: true,
      },
    );
    if (!parent) {
      throw new BadRequestException(`No parent with id ${parentId}`);
    }
    return this.addChildren(parent);
  }

  async remove(parentId: string) {
    const parent = await this.parentModel.findByIdAndUpdate(parentId, {
      isDeleted: true,
    });
    if (!parent) {
      throw new BadRequestException('No parent with such id');
    }
    return;
  }
}
