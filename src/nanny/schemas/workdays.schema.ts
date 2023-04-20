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
    example: 'true',
    description: 'available on monday',
  })
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  monday: boolean;

  @ApiProperty({
    name: 'tuesday',
    example: 'true',
    description: 'available on tuesday',
  })
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  tuesday: boolean;

  @ApiProperty({
    name: 'wednesday',
    example: 'true',
    description: 'available on wednesday',
  })
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  wednesday: boolean;

  @ApiProperty({
    name: 'thursday',
    example: 'true',
    description: 'available on thursday',
  })
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  thursday: boolean;

  @ApiProperty({
    name: 'friday',
    example: 'true',
    description: 'available on friday',
  })
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  friday: boolean;

  @ApiProperty({
    name: 'saturday',
    example: 'true',
    description: 'available on saturday',
  })
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  saturday: boolean;

  @ApiProperty({
    name: 'sunday',
    example: 'true',
    description: 'available on sunday',
  })
  @IsOptional()
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  sunday: boolean;
}

export const WorkdaysSchema = SchemaFactory.createForClass(Workdays);
