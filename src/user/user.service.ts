import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../common/enums/role.enum';
import { PasswordService } from './password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private passwordService: PasswordService,
  ) {}
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
  async updateRole(userId: string, role: string): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(userId, { role }, { new: true })
      .select('-password ');
  }
  async updatePassword(
    userId: string,
    password: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    const isPasswordEqual = await this.passwordService.verifyPassword(
      password,
      user.password,
    );
    if (isPasswordEqual) {
      throw new Error(
        'Failed to update password. The new password cannot be the same as the current password.',
      );
    }
    const hashedPassword = await this.passwordService.hashPassword(password);
    return this.userModel
      .findByIdAndUpdate(userId, { password: hashedPassword })
      .select('-password ');
  }
}
