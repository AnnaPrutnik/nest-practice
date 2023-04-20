import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class IsValidId implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (Types.ObjectId.isValid(value)) {
      return value;
    }
    throw new BadRequestException('Invalid Object ID provided');
  }
}
