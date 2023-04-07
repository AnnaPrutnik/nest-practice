import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/signIn.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User sign In' })
  @ApiResponse({ status: 200, type: String })
  @Post('login')
  async singIn(@Body() body: LoginUserDto) {
    return this.authService.signIn(body.email, body.password);
  }
}
