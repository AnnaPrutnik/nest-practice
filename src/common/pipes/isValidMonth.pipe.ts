import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import * as moment from 'moment';

@Injectable()
export class IsValidMonth implements PipeTransform<string> {
  transform(value: string | number, metadata: ArgumentMetadata) {
    const validMonth =
      moment(value, 'M MM').isValid() || moment(value, 'MMM MMMM').isValid();
    if (validMonth) {
      return value;
    }
    throw new BadRequestException('Invalid month provided');
  }
}
