import { Model } from 'mongoose';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from './password.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private passwordService: PasswordService,
  ) {}
  async create(user: CreateUserDto): Promise<UserDocument> {
    const role = user.role ? user.role : Role.Parent;
    const hashedPassword = await this.passwordService.hashPassword(
      user.password,
    );
    const newUser = {
      ...user,
      password: hashedPassword,
      role,
    };
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async getAll(limit: number, page: number) {
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
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException(`The user with id ${userId} does not exist`);
    }
    return user;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        `The user with email ${email} does not exist`,
      );
    }
    return user;
  }

  async updateRole(userId: string, role: string): Promise<UserDocument> {
    const enumValues = Object.values(Role) as string[];
    if (!enumValues.includes(role)) {
      throw new BadRequestException('Enter the valid role value');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { role }, { new: true })
      .select('-password ');
    if (!updatedUser) {
      throw new NotFoundException(`The user with id ${userId} does not exist`);
    }
    return updatedUser;
  }

  async updatePassword(userId: string, password: string) {
    //TODO: change logic for updating password by using also old password
    //or update password by using email??
    //add password validation
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`The user with id ${userId} does not exist`);
    }

    const isPasswordEqual = await this.passwordService.verifyPassword(
      password,
      user.password,
    );

    if (isPasswordEqual) {
      throw new BadRequestException(
        'Failed to update password. The new password cannot be the same as the current password.',
      );
    }
    const hashedPassword = await this.passwordService.hashPassword(password);
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
    return 'Success';
  }
}
