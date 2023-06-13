import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { IsValidId } from 'src/common/pipes/isValidId.pipe';
import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from 'src/common/interfaces/requestUser.interface';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('child')
@ApiHeader({
  name: 'Authorization',
  example: 'Bearer *user-token*',
  required: true,
  description: 'The token issued to the current user.',
})
@ApiBearerAuth('Bearer token')
@ApiUnauthorizedResponse({
  description: 'Missing header with authorization token or token is not valid.',
})
@Controller('child')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post()
  //Role access: parent
  @Roles(Role.Parent)
  @ApiOperation({ summary: 'Create new child profile' })
  @ApiCreatedResponse({ description: 'Child successfully created' })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description:
      'Bad request: child has been already created or validation error',
  })
  async create(@Body() body: CreateChildDto, @User() user: RequestUser) {
    return this.childService.create(body, user.id);
  }

  @Get('own')
  //Role access: parent
  @Roles(Role.Parent)
  @ApiOperation({
    summary: 'Retrieve information about children for logged in parent user ',
  })
  @ApiOkResponse({ description: 'Successful response: the list with children' })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  findOwnChild(@User() user: RequestUser) {
    return this.childService.findChildrenByParent(user.id);
  }

  @Get('own/:childId')
  //Role access: parent
  @Roles(Role.Parent)
  @ApiOperation({
    summary: 'Retrieve information about the child for logged in parent user ',
  })
  @ApiOkResponse({ description: 'Successful response: child profile' })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  @ApiNotFoundResponse({ description: 'No child with such id' })
  async getChildProfile(
    @User() user: RequestUser,
    @Param('childId', IsValidId) childId: string,
  ) {
    return this.childService.findOneChild(childId, user.id);
  }

  @Get('family/:parentId')
  //Role access: admin, nanny?
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Retrieve information about the children for one parent',
  })
  @ApiOkResponse({
    description: 'Successful response: the list with children for one parent',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  findAll(@Param('parentId', IsValidId) parentId: string) {
    return this.childService.findChildrenByParent(parentId);
  }

  @Get(':childId')
  //Role access: admin, nanny?
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Retrieve information about the child ',
  })
  @ApiOkResponse({
    description: 'Successful response: child profile',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  async getOneChild(@Param('childId', IsValidId) childId: string) {
    return this.childService.findById(childId);
  }

  @Put(':childId')
  //Role access: parent
  @Roles(Role.Parent)
  @ApiOperation({
    summary: 'Update information about child ',
  })
  @ApiOkResponse({
    description: 'Successful response: child profile has been updated',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  async update(
    @User() user: RequestUser,
    @Param('childId', IsValidId) childId: string,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    return this.childService.update(childId, user.id, updateChildDto);
  }

  @Delete(':childId')
  //Role access: parent
  @Roles(Role.Parent)
  @ApiOperation({
    summary: 'Delete child profile ',
  })
  @ApiOkResponse({
    description: 'Successful response: child profile has been deleted',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  async remove(
    @Param('childId', IsValidId) childId: string,
    @User() user: RequestUser,
  ) {
    await this.childService.remove(childId, user.id);
    return 'success';
  }
}
