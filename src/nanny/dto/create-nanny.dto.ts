import {
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Workdays } from '../interface/workdays.interface';
import { Type } from 'class-transformer';
export class CreateNannyDto {
  @ApiProperty({
    name: 'childMinAge',
    example: '3',
    description:
      'The minimum age of the child that a nanny is willing to sit with',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly childMinAge: number;

  @ApiProperty({
    name: 'childMaxAge',
    example: '12',
    description:
      'The maximum age of the child that a nanny is willing to sit with',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly childMaxAge: number;

  @ApiProperty({
    name: 'groupSize',
    example: '4',
    description: "The limit for the size of the children's group",
  })
  @IsNotEmpty()
  @IsNumber()
  readonly groupSize: number;

  @ApiProperty({
    name: 'dailyRate',
    example: '4',
    description: 'The payment due to the nanny for one day of work',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly dailyRate: number;

  @ApiProperty({
    name: 'workdays',
    description: 'The days of the week when nanny is available',
  })
  @ValidateNested({ each: true })
  @Type(() => Workdays)
  readonly workdays: Workdays;
}
