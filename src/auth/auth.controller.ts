import {
  Controller,
  Post,
  Body,
  Get,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/signIn.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { RequestUser } from 'src/common/interfaces/requestUser.interface';
import { UserAgent } from 'src/common/decorators/userAgent.decorator';
import { Cookie } from 'src/common/decorators/cookies.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user account and obtain access token',
  })
  @ApiCreatedResponse({ description: '"The user has successfully signed up' })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @Public()
  async singUp(@Body() body: CreateUserDto, @UserAgent() userAgent: string) {
    return this.authService.signUp(body, userAgent);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Authenticate user credentials and obtain access token',
  })
  @ApiCreatedResponse({ description: 'The user has successfully logged in' })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    description: 'Bad Credentials',
  })
  @Public()
  async singIn(
    @Body() body: LoginUserDto,
    @UserAgent() userAgent: string,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      body.email,
      body.password,
      userAgent,
    );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ accessToken });
    return;
  }

  @Get('refresh')
  @Public()
  async refresh(
    @UserAgent() userAgent: string,
    @Cookie('refresh_token') refreshToken: string,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    const tokens = await this.authService.refresh(refreshToken, userAgent);
    if (!tokens) {
      throw new UnauthorizedException();
    }

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ accessToken: tokens.accessToken });
    return;
  }

  @Get('logout')
  @ApiOperation({
    summary: 'Logout user',
  })
  @ApiOkResponse({ description: 'The user has successfully logged out' })
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: 'The token issued to the current user.',
  })
  @ApiBearerAuth('Bearer token')
  async logout(@User() user: RequestUser, @UserAgent() userAgent: string) {
    await this.authService.logout(user.id, userAgent);
    return;
  }
}
