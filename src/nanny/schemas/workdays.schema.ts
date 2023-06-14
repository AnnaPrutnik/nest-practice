import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type WorkdaysDocument = HydratedDocument<Workdays>;

@Schema({
  _id: false,
  versionKey: false,
})
export class Workdays {
  @ApiProperty({
    name: 'monday',
    example: true,
    description: 'available on Monday',
  })
  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, required: false, default: false })
  monday: boolean;

  @ApiProperty({
    name: 'tuesday',
    example: true,
    description: 'available on Tuesday',
  })
  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, required: false, default: false })
  tuesday: boolean;

  @ApiProperty({
    name: 'wednesday',
    example: true,
    description: 'available on Wednesday',
  })
  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, required: false, default: false })
  wednesday: boolean;

  @ApiProperty({
    name: 'thursday',
    example: true,
    description: 'available on Thursday',
  })
  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, required: false, default: false })
  thursday: boolean;

  @ApiProperty({
    name: 'friday',
    example: true,
    description: 'available on Friday',
  })
  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, required: false, default: false })
  friday: boolean;

  @ApiProperty({
    name: 'saturday',
    example: true,
    description: 'available on Saturday',
  })
  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, required: false, default: false })
  saturday: boolean;

  @ApiProperty({
    name: 'sunday',
    example: true,
    description: 'available on Sunday',
  })
  @IsBoolean()
  @IsOptional()
  @Prop({ type: Boolean, required: false, default: false })
  sunday: boolean;
}

export const WorkdaysSchema = SchemaFactory.createForClass(Workdays);
