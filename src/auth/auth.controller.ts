import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/signIn.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from 'src/common/decorators/publicRoute.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user account and obtain access token',
  })
  @ApiResponse({ status: 200, description: 'User successfully created' })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Public()
  @Post('signup')
  async singUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @ApiOperation({
    summary: 'Authenticate user credentials and obtain access token',
  })
  @ApiResponse({ status: 200, description: 'User successfully login' })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Bad Credentials',
  })
  @Public()
  @Post('login')
  async singIn(@Body() body: LoginUserDto) {
    return this.authService.signIn(body.email, body.password);
  }
}
