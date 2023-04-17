import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  Request,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiHeader,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { NannyService } from './nanny.service';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';
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
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({
    description: 'Conflict error. Nanny with such user id already exists',
  })
  create(
    @Body() createNannyDto: CreateNannyDto,
    @Request() req: ExpressRequest,
  ) {
    return this.nannyService.create({ ...createNannyDto, _id: req.user.id });
  }

  @Get('all')
  //Role access: admin
  @Roles(Role.Admin)
  @ApiOkResponse({
    description: 'Successful response with the list of nannies',
  })
  @ApiUnauthorizedResponse({
    description:
      'Missing header with authorization token or token is not valid.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.nannyService.findAll(limit, page);
  }

  @Get(':nannyId')
  //Role access: anybody
  findOne(@Param('nannyId') nannyId: string) {
    return this.nannyService.findOne(nannyId);
  }

  @Put(':nannyId')
  update(
    @Param('nannyId') nannyId: string,
    @Body() updateNannyDto: UpdateNannyDto,
  ) {
    return this.nannyService.update(nannyId, updateNannyDto);
  }

  @Delete(':nannyId')
  remove(@Param('nannyId') nannyId: string) {
    return this.nannyService.remove(nannyId);
  }
}
