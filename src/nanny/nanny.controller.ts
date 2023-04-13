import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
} from '@nestjs/swagger';
import { NannyService } from './nanny.service';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';

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
  @ApiOperation({ summary: 'Create new nanny' })
  @ApiOkResponse({ description: 'nanny successfully created' })
  create(@Body() createNannyDto: CreateNannyDto) {
    return this.nannyService.create(createNannyDto);
  }

  @Get()
  findAll() {
    return this.nannyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nannyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNannyDto: UpdateNannyDto) {
    return this.nannyService.update(+id, updateNannyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nannyService.remove(+id);
  }
}
