import { Injectable } from '@nestjs/common';
import { CreateNannyDto } from './dto/create-nanny.dto';
import { UpdateNannyDto } from './dto/update-nanny.dto';

@Injectable()
export class NannyService {
  create(createNannyDto: CreateNannyDto) {
    return 'This action adds a new nanny';
  }

  findAll() {
    return `This action returns all nanny`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nanny`;
  }

  update(id: number, updateNannyDto: UpdateNannyDto) {
    return `This action updates a #${id} nanny`;
  }

  remove(id: number) {
    return `This action removes a #${id} nanny`;
  }
}
