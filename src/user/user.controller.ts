import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  Request,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiHeader,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
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
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Successful response with list of users' })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  async getAllUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.getAll(page, limit);
  }

  @Get('profile')
  @ApiOperation({
    summary: "Get user's profile",
  })
  @ApiOkResponse({ description: 'Successful response with user profile' })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }

  @Put(':user_id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({ name: 'user_id', description: 'user id', type: String })
  @ApiOkResponse({
    description: 'User profile successfully updated',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. User_id is not valid.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  @ApiNotFoundResponse({
    description: 'User with such id is not exist',
  })
  async updateUser(
    @Body() body: UpdateUserDto,
    @Param() params: IsValidMongoId,
  ) {
    const user = await this.userService.update(params.user_id, body);
    return user;
  }
}
