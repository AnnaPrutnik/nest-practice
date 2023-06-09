import { Injectable } from '@nestjs/common';
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
      throw new Error(`User with email ${userInfo.email} is already exist`);
    }

    const newUser = await this.userService.create(userInfo);
    return this.tokenService.create(newUser._id.toString(), userAgent);
  }

  async signIn(email: string, password: string, userAgent: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await this.passwordService.verifyPassword(
      password,
      user.password,
    );
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      return null;
    }
    return this.tokenService.create(user._id.toString(), userAgent);
  }

  async refresh(refreshToken: string, userAgent: string) {
    return this.tokenService.updateRefreshToken(refreshToken, userAgent);
  }

  async logout(userId: string, userAgent: string) {
    await this.tokenService.removeRefreshToken(userId, userAgent);
    return;
  }
}
