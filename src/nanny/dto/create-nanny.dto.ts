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
    name: 'userId',
    example: '643562541bd65114fc504c1e',
    description: 'id from user collection',
  })
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    name: 'childMinAge',
    example: '3',
    description:
      'The minimum age of the child that a nanny is willing to sit with',
  })
  @IsNotEmpty()
  @IsNumber()
  childMinAge: number;

  @ApiProperty({
    name: 'childMaxAge',
    example: '12',
    description:
      'The maximum age of the child that a nanny is willing to sit with',
  })
  @IsNotEmpty()
  @IsNumber()
  childMaxAge: number;

  @ApiProperty({
    name: 'groupSize',
    example: '4',
    description: "The limit for the size of the children's group",
  })
  @IsNotEmpty()
  @IsNumber()
  groupSize: number;

  @ApiProperty({
    name: 'dailyRate',
    example: '4',
    description: 'The payment due to the nanny for one day of work',
  })
  @IsNotEmpty()
  @IsNumber()
  dailyRate: number;

  @ApiProperty({
    name: 'workdays',
    description: 'The days of the week when nanny is available',
  })
  @ValidateNested({ each: true })
  @Type(() => Workdays)
  workdays: Workdays;
}
