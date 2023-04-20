import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdatePasswordDto {
  @ApiProperty({ name: 'password', example: '123456', description: 'password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class UpdateRoleDto {
  @ApiProperty({
    example: 'parent',
    description: 'Role for user from list: admin, parent, nanny',
    enum: Role,
  })
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Please enter correct role' })
  readonly role: Role;
}
