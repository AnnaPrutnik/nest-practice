import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Request,
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
import { NannyService } from './nanny.service';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';
import { IsValidId } from 'src/common/pipes/isValidId.pipe';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from 'src/common/interfaces/requestUser.interface';

@ApiTags('nanny')
@ApiHeader({
  name: 'Authorization',
  example: 'Bearer *user-token*',
  required: true,
  description: 'The token issued to the current user.',
})
@ApiBearerAuth('Bearer token')
@Controller('nanny')
export class NannyController {
  constructor(private readonly nannyService: NannyService) {}

  @Post()
  // Role access: nanny
  @Roles(Role.Nanny)
  @ApiOperation({ summary: 'Create new nanny' })
  @ApiCreatedResponse({ description: 'Nanny successfully created' })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description:
      'Bad request: nanny has been already exist or validation error',
  })
  async create(@Body() body: CreateNannyDto, @User() user: RequestUser) {
    try {
      const nanny = await this.nannyService.create(body, user.id);
      return nanny;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('all')
  //Role access: anyone
  @ApiOperation({ summary: 'Get all nannies' })
  @ApiOkResponse({
    description: 'Successful response with the list of nannies',
  })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.nannyService.findAll(limit, page);
  }

  @Get(':nannyId')
  //Role access: anyone
  @ApiOperation({ summary: 'Create nanny by id' })
  @ApiOkResponse({
    description: 'Successful response with nanny data',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: id in params is not valid',
  })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  @ApiNotFoundResponse({ description: 'There is no nanny with such id' })
  async findOne(@Param('nannyId', IsValidId) nannyId: string) {
    const nanny = await this.nannyService.findOne(nannyId);
    if (!nanny) {
      throw new NotFoundException(`Nanny with id ${nannyId} is not exist`);
    }
    return nanny;
  }

  @Put(':nannyId')
  //Role access: nanny and admin
  @Roles(Role.Admin, Role.Nanny)
  @ApiOperation({ summary: 'Update nanny' })
  @ApiOkResponse({
    description: 'Successful response with updated nanny data',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  async update(
    @Param('nannyId', IsValidId) nannyId: string,
    @Body() updateNannyDto: UpdateNannyDto,
  ) {
    try {
      const updatedNanny = await this.nannyService.update(
        nannyId,
        updateNannyDto,
      );
      return updatedNanny;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':nannyId')
  //Role access: admin, nanny
  @ApiOperation({ summary: 'Delete nanny' })
  @Roles(Role.Admin, Role.Nanny)
  @ApiOkResponse({
    description: 'Successful response',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  @ApiNotFoundResponse({ description: 'There is no nanny with such id' })
  async delete(@Param('nannyId', IsValidId) nannyId: string) {
    const nanny = await this.nannyService.delete(nannyId);
    if (!nanny) {
      throw new NotFoundException(`Nanny with id ${nannyId} is not exist`);
    }
    return true;
  }
}
