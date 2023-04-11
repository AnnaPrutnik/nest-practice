import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../interface/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'username',
    description:
      'username, not required field, in case without username, it would be generated from email',
  })
  @IsOptional()
  @IsString()
  readonly username: string;

  @ApiProperty({ example: 'username@mail.com', description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123456', description: 'password' })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({
    example: 'Parent',
    description: 'Role for user from list: Admin, Parent, Nanny',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Please enter correct role' })
  readonly role: string;
}
