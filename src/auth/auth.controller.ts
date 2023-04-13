import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/signIn.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user account and obtain access token',
  })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Public()
  async singUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Authenticate user credentials and obtain access token',
  })
  @ApiResponse({ status: 201, description: 'User successfully login' })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 401,
    description: 'Bad Credentials',
  })
  @Public()
  async singIn(@Body() body: LoginUserDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Get('logout')
  @ApiOperation({
    summary: 'Logout user',
  })
  @ApiResponse({ status: 200, description: 'User successfully logout' })
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: 'The token issued to the current user.',
  })
  @ApiBearerAuth('Bearer token')
  async logout(@Request() req: ExpressRequest) {
    await this.authService.logout(req.user.id);
    return;
  }
}
