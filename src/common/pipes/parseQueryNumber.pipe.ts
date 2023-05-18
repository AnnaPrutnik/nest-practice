import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseQueryNumber implements PipeTransform<string> {
  constructor(private defaultValue: number) {}
  transform(value: string, metadata: ArgumentMetadata) {
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
      return this.defaultValue;
    }
    return numberValue;
  }
}
