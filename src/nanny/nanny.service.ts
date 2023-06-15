import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nanny } from './schemas/nanny.schema';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';

@Injectable()
export class NannyService {
  constructor(@InjectModel(Nanny.name) private nannyModel: Model<Nanny>) {}

  async create(body: CreateNannyDto, userId: string) {
    const existNanny = await this.nannyModel
      .findById(userId)
      .select('isDeleted');
    if (existNanny) {
      if (!existNanny.isDeleted) {
        throw new BadRequestException('You have already registered as nanny');
      }
      return this.nannyModel.findByIdAndUpdate(
        userId,
        { ...body, isDeleted: false },
        { new: true },
      );
    }

    const nannyDoc = await this.nannyModel.create({ ...body, _id: userId });
    const { isDeleted, _id, ...nanny } = nannyDoc.toObject();
    return { ...nanny, id: nannyDoc.id };
  }

  async findAll(limit: number, page: number) {
    const skip = limit * (page - 1);

    const nannies = await this.nannyModel
      .find({ isDeleted: false })
      .limit(limit)
      .skip(skip)
      .exec();

    const total = await this.nannyModel.count();
    const pages = Math.ceil(total / limit);
    return { nannies, total, page, pages, limit };
  }

  async findOne(nannyId: string) {
    const nanny = await this.nannyModel.findOne({
      _id: nannyId,
      isDeleted: false,
    });

    if (!nanny) {
      return null;
    }

    return nanny;
  }

  async update(nannyId: string, updateNannyDto: UpdateNannyDto) {
    const nanny = await this.nannyModel
      .findOne({ _id: nannyId, isDeleted: false })
      .lean();

    if (!nanny) {
      throw new NotFoundException('There is no nanny with such id');
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

  async remove(nannyId: string) {
    const nanny = await this.nannyModel.findByIdAndUpdate(nannyId, {
      isDeleted: true,
    });

    if (!nanny) {
      throw new NotFoundException(`Nanny with id ${nannyId} is not exist`);
    }
    return;
  }
}
