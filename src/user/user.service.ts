import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto): Promise<UserDocument> {
    const role = user.role ? user.role : Role.Parent;
    const newUser = {
      ...user,
      role,
    };
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async getAll(page, limit) {
    const skip = limit * (page - 1);
    const users = await this.userModel
      .find({})
      .select('-password')
      .limit(limit)
      .skip(skip);
    const total = await this.userModel.find({}).count();
    const pages = Math.ceil(total / limit);
    return { users, total, page, pages };
  }

  async getById(userId: string): Promise<UserDocument> {
    return this.userModel.findById(userId).select('-password');
  }

  async getByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async update(userId: string, body: UpdateUserDto): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(userId, { ...body }, { new: true })
      .select('-password ');
  }
}
