import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
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
import { HireService } from './hire.service';
import { CreateHireDto } from './dto/create-hire.dto';
import { UpdateHireDto } from './dto/update-hire.dto';
import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from 'src/common/interfaces/requestUser.interface';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { IsValidId } from 'src/common/pipes/isValidId.pipe';
import { IsValidMonth } from 'src/common/pipes/isValidMonth.pipe';

@ApiTags('hire')
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
@Controller('hire')
export class HireController {
  constructor(private readonly hireService: HireService) {}

  @Post()
  //Role access: Parent
  @Roles(Role.Parent)
  @ApiOperation({ summary: 'Request for new hiring' })
  @ApiCreatedResponse({
    description: 'Reservation has been successfully created',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  async create(@Body() body: CreateHireDto, @User() user: RequestUser) {
    try {
      const hire = await this.hireService.create(body, user.id);
      return hire;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':hireId')
  //Role access: anyone
  @ApiOperation({ summary: 'Hiring details' })
  @ApiOkResponse({
    description: 'Successful response: details about hiring',
  })
  @ApiNotFoundResponse({
    description: 'No hiring with such id',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  async findOne(@Param('hireId', IsValidId) hireId: string) {
    const hire = await this.hireService.getOne(hireId);
    if (!hire) {
      throw new BadRequestException('No hiring with such id');
    }
    return hire;
  }

  @Put(':hireId')
  //Role access: parent
  @Roles(Role.Parent)
  @ApiOperation({ summary: 'Update hiring details' })
  @ApiOkResponse({
    description: 'Successful response: details about hiring',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden error. User are not authorized to access this resource',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  async changeDetails(
    @Param('hireId', IsValidId) hireId: string,
    @Body() updateHireDto: UpdateHireDto,
  ) {
    try {
      const hire = await this.hireService.update(hireId, updateHireDto);
      return hire;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('cancel/:hireId')
  //Role access: anyone
  @ApiOperation({ summary: 'Cancel hiring ' })
  @ApiOkResponse({
    description: 'Successful response:hire has been canceled',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  canceled(@Param('hireId', IsValidId) hireId: string) {
    return this.hireService.cancel(hireId);
  }

  @Get('close/:hireId')
  //Role access: anyone
  @ApiOperation({ summary: 'Complete hiring' })
  @ApiOkResponse({
    description: 'Successful response:hire has been closed',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  closed(@Param('hireId', IsValidId) hireId: string) {
    return this.hireService.close(hireId);
  }

  @Get('nanny/:nannyId')
  //Role access: nanny, admin
  @Roles(Role.Nanny, Role.Admin)
  @ApiOperation({ summary: 'Get all hiring for month' })
  @ApiOkResponse({
    description: 'Successful response:hire has been closed',
  })
  @ApiBadRequestResponse({
    description: 'Bad request: validation error',
  })
  async nannyMonthHiring(
    @Param('nannyId', IsValidId) nannyId: string,
    @Query('month', IsValidMonth) month: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(10), ParseIntPipe) page: number,
  ) {
    try {
      const monthHire = await this.hireService.nannyMonthHire(
        nannyId,
        month,
        limit,
        page,
      );
      return monthHire;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

