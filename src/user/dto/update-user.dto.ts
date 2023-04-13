import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
// export class UpdateUserDto {
//   @ApiProperty({
//     example: 'username',
//     description:
//       'username, not required field, in case without username, it would be generated from email',
//   })
//   @IsOptional()
//   @IsString()
//   readonly username: string;

//   @ApiProperty({ example: 'username@mail.com', description: 'email' })
//   @IsOptional()
//   @IsEmail()
//   readonly email: string;

//   @ApiProperty({ example: '123456', description: 'password' })
//   @IsOptional()
//   @IsNotEmpty()
//   readonly password: string;

//   @ApiProperty({ example: '', description: 'birthday' })
//   @IsOptional()
//   @IsNotEmpty()
//   @IsDateString()
//   readonly birthday: Date;

//   @ApiProperty({
//     example: 'Parent',
//     description: 'Role for user from list: Admin, Parent, Nanny',
//     enum: Role,
//   })
//   @IsOptional()
//   @IsEnum(Role, { message: 'Please enter correct role' })
//   readonly role: Role;
// }
