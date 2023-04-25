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
import { ParentService } from './parent.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from 'src/common/interfaces/requestUser.interface';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { IsValidId } from 'src/common/pipes/isValidId.pipe';

@ApiTags('parent')
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
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  // Role access: parent
  @Roles(Role.Parent)
  @ApiOperation({ summary: 'Create new parent profile' })
  @ApiCreatedResponse({ description: 'Parent successfully created' })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description:
      'Bad request: parent has been already exist or validation error',
  })
  async create(
    @Body() createParentDto: CreateParentDto,
    @User() user: RequestUser,
  ) {
    try {
      const parent = await this.parentService.create(createParentDto, user.id);
      return parent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':parentId')
  //Role access: anyone
  @ApiOperation({ summary: 'Get single parent by id' })
  @ApiOkResponse({ description: 'Successful response with parent profile' })
  @ApiNotFoundResponse({ description: 'There is no parent with such id' })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  async findOne(@Param('parentId', IsValidId) parentId: string) {
    const parent = await this.parentService.findOne(parentId);
    if (!parent) {
      throw new NotFoundException(`No parent with id ${parentId}`);
    }
    return parent;
  }

  @Put(':parentId')
  //Role access: parent and admin
  @Roles(Role.Admin, Role.Parent)
  @ApiOperation({ summary: 'Update parent profile' })
  @ApiOkResponse({
    description: 'Successful response: parent profile has been updated',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  async update(
    @Param('parentId', IsValidId) parentId: string,
    @Body() body: UpdateParentDto,
  ) {
    try {
      const parent = await this.parentService.update(parentId, body);
      return parent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':parentId')
  //Role access: parent and admin
  @ApiOperation({ summary: 'Delete parent profile' })
  @ApiOkResponse({
    description: 'Successful response: parent profile has been deleted',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  @Roles(Role.Admin, Role.Parent)
  async remove(@Param('parentId') parentId: string) {
    const parent = await this.parentService.remove(parentId);
    if (!parent) {
      throw new NotFoundException('No parent with such id');
    }
    return;
  }
}
