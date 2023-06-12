import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PasswordService } from 'src/user/password.service';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private passwordService: PasswordService,
  ) {}

  async signUp(userInfo: CreateUserDto, userAgent: string) {
    const existedUser = await this.userService.getByEmail(userInfo.email);
    if (existedUser) {
      throw new BadRequestException(
        `User with email ${userInfo.email} is already exist`,
      );
    }
    const newUser = await this.userService.create(userInfo);
    return this.tokenService.create(newUser.id, userAgent);
  }

  async signIn(email: string, password: string, userAgent: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      throw new BadRequestException('Bad Credentials');
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Bad Credentials');
    }
    return this.tokenService.create(user.id, userAgent);
  }

  async refresh(refreshToken: string, userAgent: string) {
    const tokens = await this.tokenService.updateRefreshToken(
      refreshToken,
      userAgent,
    );

    if (!tokens) {
      throw new UnauthorizedException(
        'Refresh token does not exist or is invalid',
      );
    }

    return tokens;
  }

  async logout(userId: string, userAgent: string) {
    await this.tokenService.removeRefreshToken(userId, userAgent);
    return;
  }
}
