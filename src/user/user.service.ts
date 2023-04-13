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
      throw new BadRequestException(error.message);
    }
  }

  async getAll(page, limit): Promise<UserDocument[]> {
    const skip = limit * (page - 1);
    return this.userModel
      .find({})
      .select('-password -token')
      .limit(limit)
      .skip(skip);
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException(`No user by id ${id}`);
    }
    return user;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async update(id: string, body: UpdateUserDto): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, { ...body }, { new: true })
      .select('-password -token');
  }

  async setToken(id: string, token: string) {
    await this.userModel.findByIdAndUpdate(id, { token });
    return;
  }

  async removeToken(id: string) {
    await this.userModel.findByIdAndUpdate(id, { token: null });
    return;
  }
}
