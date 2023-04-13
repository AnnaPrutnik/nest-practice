import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class Workdays {
  @ApiProperty({
    name: 'monday',
    example: 'true',
    description: 'available on monday',
  })
  @IsNotEmpty()
  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  monday: boolean;

  @ApiProperty({
    name: 'tuesday',
    example: 'true',
    description: 'available on tuesday',
  })
  @IsNotEmpty()
  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  tuesday: boolean;

  @ApiProperty({
    name: 'wednesday',
    example: 'true',
    description: 'available on wednesday',
  })
  @IsNotEmpty()
  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  wednesday: boolean;

  @ApiProperty({
    name: 'thursday',
    example: 'true',
    description: 'available on thursday',
  })
  @IsNotEmpty()
  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  thursday: boolean;

  @ApiProperty({
    name: 'friday',
    example: 'true',
    description: 'available on friday',
  })
  @IsNotEmpty()
  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  friday: boolean;

  @ApiProperty({
    name: 'saturday',
    example: 'true',
    description: 'available on saturday',
  })
  @IsNotEmpty()
  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  saturday: boolean;

  @ApiProperty({
    name: 'sunday',
    example: 'true',
    description: 'available on sunday',
  })
  @IsNotEmpty()
  @IsBoolean()
  @Prop({ type: Boolean, required: true })
  sunday: boolean;
}
