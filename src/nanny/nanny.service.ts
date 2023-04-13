import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';
import { Nanny } from './schemas/nanny.schema';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class NannyService {
  constructor(
    @InjectModel(Nanny.name) private nannyModel: Model<Nanny>,
    private userService: UserService,
  ) {}

  async create(body: CreateNannyDto) {
    const existNanny = await this.nannyModel.findOne({ userId: body.userId });
    if (existNanny) {
      throw new ConflictException('You have already registered as nanny');
    }
    const user = await this.userService.getById(body.userId);
    if (user.role !== Role.Nanny) {
      throw new ForbiddenException('Role only should be nanny');
    }
    try {
      const nanny = new this.nannyModel(body);
      return nanny.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return `This action returns all nanny`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nanny`;
  }

  update(id: number, updateNannyDto: UpdateNannyDto) {
    return `This action updates a #${id} nanny`;
  }

  remove(id: number) {
    return `This action removes a #${id} nanny`;
  }
}
