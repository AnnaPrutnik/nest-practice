import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Workdays } from '../schemas/workdays.schema';
export class CreateNannyDto {
  @ApiProperty({
    required: true,
    name: 'firstName',
    example: 'Katherine',
    description: 'first name',
  })
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    required: true,
    name: 'lastName',
    example: 'Smith',
    description: 'last name',
  })
  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    required: true,
    name: 'birthday',
    example: '1986-05-25',
    description: 'birthday',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly birthday: Date;

  @ApiProperty({
    required: true,
    name: 'childMinAge',
    example: '3',
    description:
      'The minimum age of the child that a nanny is willing to sit with',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly childMinAge: number;

  @ApiProperty({
    required: true,
    name: 'childMaxAge',
    example: '12',
    description:
      'The maximum age of the child that a nanny is willing to sit with',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly childMaxAge: number;

  @ApiProperty({
    required: true,
    name: 'groupSize',
    example: '4',
    description: "The limit for the size of the children's group",
  })
  @IsNotEmpty()
  @IsNumber()
  readonly groupSize: number;

  @ApiProperty({
    required: true,
    name: 'dailyRate',
    example: '4',
    description: 'The payment due to the nanny for one day of work',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly dailyRate: number;

  @ApiProperty({
    required: true,
    name: 'workdays',
    description: 'The days of the week when nanny is available',
  })
  readonly workdays: Workdays;
}
