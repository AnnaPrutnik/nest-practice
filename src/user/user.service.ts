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
import { Role } from './interface/role.enum';

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
      return await createdUser.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll(): Promise<UserDocument[]> {
    return await this.userModel.find({});
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`No user by id ${id}`);
    }
    return user;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async update(id: string, body: UpdateUserDto): Promise<UserDocument> {
    return await this.userModel.findByIdAndUpdate(
      id,
      { ...body },
      { new: true },
    );
  }
}
