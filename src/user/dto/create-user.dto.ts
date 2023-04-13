import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  MinLength,
  IsDateString,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'username',
    description: 'username, not required field',
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

  @ApiProperty({ example: '1986-05-25', description: 'birthday' })
  @IsOptional()
  @IsDateString()
  readonly birthday: Date;

  @ApiProperty({
    example: 'parent',
    description: 'Role for user from list: admin, parent, nanny',
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Please enter correct role' })
  readonly role: Role;
}
