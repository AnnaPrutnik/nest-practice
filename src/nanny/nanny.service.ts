import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Nanny } from './schemas/nanny.schema';
import { UpdateNannyDto } from './dto/update-nanny.dto';

import { UserService } from 'src/user/user.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class NannyService {
  constructor(
    @InjectModel(Nanny.name) private nannyModel: Model<Nanny>,
    private userService: UserService,
  ) {}

  async create(body: Nanny) {
    const existNanny = await this.nannyModel.findOne({ id: body._id });
    if (existNanny) {
      throw new ConflictException('You have already registered as nanny');
    }
    const user = await this.userService.getById(body._id.toString());
    if (user.role !== Role.Nanny) {
      throw new ForbiddenException('Role only should be nanny');
    }
    try {
      const nanny = await this.nannyModel.create(body);
      return nanny.populate('user', 'username birthday');
    } catch (error) {
      console.log('catch during saving nanny');
      throw new BadRequestException(error.message);
    }
  }

  async findAll(limit: number, page: number) {
    const skip = limit * (page - 1);
    const nannies = await this.nannyModel
      .find({})
      .limit(limit)
      .skip(skip)
      .populate('user', 'username birthday');
    const total = await this.nannyModel.find({}).count();
    const pages = Math.ceil(total / limit);
    return { nannies, total, page, pages };
  }

  async findOne(nannyId: string) {
    return await this.nannyModel.findById(nannyId);
  }

  update(nannyId: string, updateNannyDto: UpdateNannyDto) {
    return `This action updates a #${nannyId} nanny`;
  }

  remove(nannyId: string) {
    return `This action removes a #${nannyId} nanny`;
  }
}
