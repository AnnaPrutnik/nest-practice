import { Controller, Get, Param, Body, Put, Request } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from './interface/user.interface';
import { IsValidMongoId } from 'src/common/pipes/isValidId.pipe';
import { Request as ExpressRequest } from 'express';

@ApiTags('user')
@ApiHeader({
  name: 'Authorization',
  required: true,
  description: 'The token issued to the current user.',
})
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    type: [User],
    description: 'Successful response with list of users',
  })
  @ApiResponse({
    status: 401,
    description:
      'Missing header with authorization token or token is not valid.',
  })
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @Get('profile')
  @ApiOperation({
    summary: "Get user's profile",
  })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({
    status: 401,
    description:
      'Missing header with authorization token or token is not valid.',
  })
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }

  @Put(':user_id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({ name: 'user_id', description: 'user id', type: String })
  @ApiResponse({
    status: 200,
    description: 'User profile successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. User_id is not valid.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Missing header with authorization token or token is not valid.',
  })
  @ApiResponse({
    status: 404,
    description: 'User with such id is not exist',
  })
  async updateUser(
    @Body() body: UpdateUserDto,
    @Param() params: IsValidMongoId,
  ) {
    return await this.userService.update(params.user_id, body);
  }
}
