import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nanny } from './schemas/nanny.schema';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class NannyService {
  constructor(
    @InjectModel(Nanny.name) private nannyModel: Model<Nanny>,
    private userService: UserService,
  ) {}

  async create(body: CreateNannyDto, id: string) {
    const existNanny = await this.nannyModel.findById(id);
    if (existNanny) {
      if (existNanny.isActive) {
        throw new ConflictException('You have already registered as nanny');
      }
      return this.nannyModel.findByIdAndUpdate(
        id,
        { ...body, isActive: true },
        { new: true },
      );
    }
    const user = await this.userService.getById(id);
    if (user.role !== Role.Nanny) {
      throw new ForbiddenException('Role only should be a nanny');
    }
    try {
      const nanny = await this.nannyModel.create({ ...body, _id: id });
      return nanny;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(limit: number, page: number) {
    const skip = limit * (page - 1);
    const nannies = await this.nannyModel
      .find({ isActive: true })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await this.nannyModel.find({ isActive: true }).count();
    const pages = Math.ceil(total / limit);
    return { nannies, total, page, pages };
  }

  async findOne(nannyId: string) {
    const nanny = await this.nannyModel.findById(nannyId);
    if (!nanny || !nanny.isActive) {
      throw new NotFoundException(`Nanny with id ${nannyId} is not exist`);
    }
    return nanny;
  }

  async update(nannyId: string, updateNannyDto: UpdateNannyDto) {
    const nanny = await this.nannyModel.findById(nannyId).lean();
    if (!nanny || !nanny.isActive) {
      throw new NotFoundException('There is no nanny with such id');
    }
    const nannyWithUpdates = {
      ...nanny,
      ...updateNannyDto,
      workdays: { ...nanny.workdays, ...updateNannyDto.workdays },
    };
    console.log('nannyWithUpdates', nannyWithUpdates);
    try {
      const updatedNanny = await this.nannyModel.findByIdAndUpdate(
        nannyId,
        nannyWithUpdates,
        {
          new: true,
        },
      );
      return updatedNanny;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(nannyId: string) {
    const nanny = await this.nannyModel.findByIdAndUpdate(nannyId, {
      isActive: false,
    });
    if (!nanny) {
      throw new NotFoundException(`Nanny with id ${nannyId} is not exist`);
    }
    return true;
  }
}
