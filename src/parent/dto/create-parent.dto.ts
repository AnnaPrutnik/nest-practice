import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParentDto {
  @ApiProperty({
    name: 'firstName',
    example: 'Maria',
    description: 'parent first name',
  })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    name: 'lastName',
    example: 'Broderik',
    description: 'parent last name',
  })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ name: 'birthday', example: '1995-07-25' })
  @IsDateString()
  @IsNotEmpty()
  readonly birthday: Date;
}
