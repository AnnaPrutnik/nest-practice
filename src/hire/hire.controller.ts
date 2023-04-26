import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
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
  @ApiOperation({ summary: 'Request for new hired' })
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
  @ApiOperation({ summary: 'Hire details' })
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
  findOne(@Param('hireId') hireId: string) {
    return this.hireService.getOne(hireId);
  }

  @Put(':hireId')
  async changeDate(
    @Param('hireId') hireId: string,
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
  canceled(@Param('hireId') hireId: string) {
    return;
  }

  @Get('close/:hireId')
  closed(@Param('hireId') hireId: string) {
    return;
  }
}
