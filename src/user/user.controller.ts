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
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { IsValidMongoId } from 'src/common/pipes/isValidId.pipe';
import { Request as ExpressRequest } from 'express';

@ApiTags('user')
@ApiHeader({
  name: 'Authorization',
  example: 'Bearer *user-token*',
  required: true,
  description: 'The token issued to the current user.',
})
@ApiBearerAuth('Bearer token')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  //Role access: only for admin
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false })
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
  //Role access: anybody
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

  @Put(':userId')
  //Role access: maybe this route would be accessible only for admin
  //and then is going to add the route with PUT method to 'profile' for updating user profile
  //by using id from req.user ??
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({ name: 'userId', description: 'user id', type: String })
  @ApiOkResponse({
    description: 'User profile successfully updated',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. User id is not valid.',
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
    const user = await this.userService.update(params.userId, body);
    return user;
  }
}
