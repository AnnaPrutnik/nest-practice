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
  ApiConflictResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { NannyService } from './nanny.service';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';
import { IsValidId } from 'src/common/pipes/isValidId.pipe';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Request as ExpressRequest } from 'express';

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
  //Role access: nanny
  // @Roles(Role.Nanny)
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
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({
    description: 'Conflict error. Nanny with such user id already exists',
  })
  create(@Body() body: CreateNannyDto, @Request() req: ExpressRequest) {
    return this.nannyService.create(body, req.user.id);
  }

  @Get('all')
  //Role access: anybody
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
  //Role access: anybody
  @ApiOkResponse({
    description: 'Successful response with nanny data',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  @ApiNotFoundResponse({ description: 'There is no nanny with such id' })
  async findOne(@Param('nannyId', IsValidId) nannyId: string) {
    return this.nannyService.findOne(nannyId);
  }

  @Put(':nannyId')
  //Role access: nanny and admin
  // @Roles(Role.Admin, Role.Nanny)
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
  update(
    @Param('nannyId', IsValidId) nannyId: string,
    @Body() updateNannyDto: UpdateNannyDto,
  ) {
    return this.nannyService.update(nannyId, updateNannyDto);
  }

  @Delete(':nannyId')
  //Role access: admin, nanny
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
    return this.nannyService.delete(nannyId);
  }
}
