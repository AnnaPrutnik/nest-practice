import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nanny } from './schemas/nanny.schema';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';

@Injectable()
export class NannyService {
  constructor(@InjectModel(Nanny.name) private nannyModel: Model<Nanny>) {}

  async create(body: CreateNannyDto, id: string) {
    const existNanny = await this.nannyModel.findById(id);
    if (existNanny) {
      if (!existNanny.isDeleted) {
        throw new Error('You have already registered as nanny');
      }
      return this.nannyModel.findByIdAndUpdate(
        id,
        { ...body, isDeleted: false },
        { new: true },
      );
    }
    return this.nannyModel.create({ ...body, _id: id });
  }

  async findAll(limit: number, page: number) {
    const skip = limit * (page - 1);
    const nannies = await this.nannyModel
      .find({ isDeleted: false })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await this.nannyModel.find({ isDeleted: false }).count();
    const pages = Math.ceil(total / limit);
    return { nannies, total, page, pages };
  }

  async findOne(nannyId: string) {
    return this.nannyModel.findOne({ id: nannyId, isDeleted: false });
  }

  async update(nannyId: string, updateNannyDto: UpdateNannyDto) {
    const nanny = await this.nannyModel
      .findOne({ id: nannyId, isActive: true })
      .lean();
    if (!nanny) {
      throw new Error('There is no nanny with such id');
    }
    const nannyWithUpdates = {
      ...nanny,
      ...updateNannyDto,
      workdays: { ...nanny.workdays, ...updateNannyDto.workdays },
    };

    return this.nannyModel.findByIdAndUpdate(nannyId, nannyWithUpdates, {
      new: true,
    });
  }

  async delete(nannyId: string) {
    return this.nannyModel.findByIdAndUpdate(nannyId, {
      isDeleted: false,
    });
  }
}
