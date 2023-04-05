import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @Get('bla')
  async getBlaUser() {
    return await this.userService.getByEmail('bla');
  }

  @Get(':id')
  async getSingleUser(@Param() params) {
    return await this.userService.getById(params.id);
  }

  @Post()
  async addUser(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }
}
