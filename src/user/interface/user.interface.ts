import { Role } from './role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: '643016980dcef13250526088',
    description: 'user id',
  })
  id: string;

  @ApiProperty({
    example: 'user name',
    description: 'user name',
  })
  username: string;

  @ApiProperty({
    example: 'email@mail.com',
    description: 'user email',
  })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'user password',
  })
  password: string;

  @ApiProperty({
    example: 'parent',
    description: 'user role',
  })
  role: Role;
}
