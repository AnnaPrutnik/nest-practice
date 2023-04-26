import {
  IsNotEmpty,
  IsMongoId,
  IsString,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHireDto {
  @ApiProperty({
    name: 'nanny',
    example: 'mongoId',
    description: 'ref to nanny profile',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  nanny: string;

  @ApiProperty({
    name: 'children',
    example: 'array of mongoId',
    description: 'ref to child profiles',
  })
  @IsNotEmpty()
  @IsArray()
  children: string[];

  @ApiProperty({
    name: 'date',
    example: '2015-03-05',
    description: 'the day when the nanny is hired',
  })
  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
