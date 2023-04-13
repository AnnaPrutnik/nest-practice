import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NannyService } from './nanny.service';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';

@Controller('nanny')
export class NannyController {
  constructor(private readonly nannyService: NannyService) {}

  @Post()
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
