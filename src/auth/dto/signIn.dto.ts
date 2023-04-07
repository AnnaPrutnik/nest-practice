import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'user@mail.com', description: 'user email' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: '123456qwe', description: 'user password' })
  @IsNotEmpty()
  readonly password: string;
}
