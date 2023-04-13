import { Model } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto): Promise<UserDocument> {
    const username = user.username ? user.username : user.email.split('@')[0];
    const role = user.role ? user.role : Role.Parent;

    const newUser = {
      ...user,
      username,

      role,
    };
    try {
      const createdUser = new this.userModel(newUser);
      return createdUser.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Validation error');
    }
  }

  async getAll(page, limit) {
    const skip = limit * (page - 1);
    const users = await this.userModel
      .find({})
      .select('-password -token')
      .limit(limit)
      .skip(skip);
    const total = await this.userModel.find({}).count();
    const pages = Math.ceil(total / limit);
    return { users, total, page, pages };
  }

  async getById(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException(`No user by id ${userId}`);
    }
    return user;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async update(userId: string, body: UpdateUserDto): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(userId, { ...body }, { new: true })
      .select('-password -token');
  }

  async setToken(userId: string, token: string) {
    await this.userModel.findByIdAndUpdate(userId, { token });
    return;
  }

  async removeToken(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { token: null });
    return;
  }
}
