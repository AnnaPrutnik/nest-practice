import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  NotFoundException,
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
import { UserService } from './user.service';
import { IsValidId } from 'src/common/pipes/isValidId.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from 'src/common/interfaces/requestUser.interface';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateRoleDto, UpdatePasswordDto } from './dto/update-user.dto';

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
  // @Roles(Role.Admin)
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

  // @Get(':userId')
  // //Role access: only for admin
  // @Roles(Role.Admin)
  // @ApiOperation({
  //   summary: "Get user's profile",
  // })
  // @ApiParam({ name: 'userId', description: 'user id', type: String })
  // @ApiOkResponse({ description: 'Successful response with user profile' })
  // @ApiUnauthorizedResponse({
  //   description:
  //     'Missing header with authorization token or token is not valid.',
  // })
  // async getProfile(@Param('userId', IsValidId) userId: string) {
  //   const user = await this.userService.getById(userId);
  //   if (!user) {
  //     throw new NotFoundException(`The user with id ${userId} does not exist`);
  //   }
  // }
  // @Put('role/:userId')
  // //Role access: only for admin
  // @Roles(Role.Admin)
  // @ApiOperation({ summary: 'Update user role' })
  // @ApiParam({ name: 'userId', description: 'user id', type: String })
  // @ApiOkResponse({
  //   description: 'User role has successfully updated',
  // })
  // @ApiBadRequestResponse({
  //   description: 'Bad request. User id is not valid.',
  // })
  // @ApiUnauthorizedResponse({
  //   description:
  //     'Missing header with authorization token or token is not valid.',
  // })
  // @ApiNotFoundResponse({
  //   description: 'User with such id is not exist',
  // })
  // async updateUser(
  //   @Body() body: UpdateRoleDto,
  //   @Param('userId', IsValidId) userId: string,
  // ) {
  //   try {
  //     const user = await this.userService.updateRole(userId, body.role);
  //     return user;
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
  // @Put('password')
  // //Role access: anyone
  // @ApiOperation({ summary: 'Update user password' })
  // @ApiOkResponse({
  //   description: 'User role has successfully updated',
  // })
  // @ApiBadRequestResponse({
  //   description: 'Bad request. User id is not valid.',
  // })
  // @ApiUnauthorizedResponse({
  //   description:
  //     'Missing header with authorization token or token is not valid.',
  // })
  // @ApiNotFoundResponse({
  //   description: 'User with such id is not exist',
  // })
  // async changePassword(
  //   @Body() body: UpdatePasswordDto,
  //   @User() user: RequestUser,
  // ) {
  //   try {
  //     await this.userService.updatePassword(user.id, body.password);
  //     return 'Password has been updated successfully.';
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
