import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { IsValidMongoId } from './dto/isValidId.pipe';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: User })
  @Post()
  async addUser(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @ApiOperation({ summary: 'Get single users by id' })
  @ApiResponse({ status: 200, type: User })
  @Get(':id')
  async getSingleUser(@Param() params: IsValidMongoId) {
    return await this.userService.getById(params.id);
  }

  @ApiOperation({ summary: 'Update users by id' })
  @ApiResponse({ status: 200, type: User })
  @Put(':id')
  async updateUser(
    @Body() body: UpdateUserDto,
    @Param() params: IsValidMongoId,
  ) {
    return await this.userService.update(params.id, body);
  }
}
