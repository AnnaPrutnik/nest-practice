import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../schemas/gender.enum';

export class CreateChildDto {
  @ApiProperty({
    name: 'name',
    example: 'Kate',
    description: 'child name',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    name: 'birthday',
    example: '2015-03-05',
    description: 'child birthday',
  })
  @IsDateString()
  @IsNotEmpty()
  readonly birthday: Date;

  @ApiProperty({
    name: 'gender',
    example: 'male',
    description: 'gender can be "male" or "female"',
  })
  @IsNotEmpty()
  @IsEnum(Gender, { message: 'Please enter correct gender: male or female' })
  readonly gender: Gender;
}
