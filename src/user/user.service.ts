import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ROLE } from 'config/role';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(user: CreateUserDto) {
    const username = user.username ? user.username : user.email.split('@')[0];
    const newUser = {
      ...user,
      username,
      role: ROLE.CUSTOMER,
    };
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  getAll() {
    return this.userModel.find({});
  }

  getById(id: string) {
    const user = this.userModel.findById(id);
    return user;
  }

  getByEmail(email: string) {
    const user = this.userModel.findOne({ email });
    return user;
  }
}
