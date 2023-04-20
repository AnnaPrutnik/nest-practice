import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'username@mail.com', description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123456', description: 'password' })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({
    example: 'parent',
    description: 'Role for user from list: admin, parent, nanny',
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Please enter correct role' })
  readonly role: Role;
}
