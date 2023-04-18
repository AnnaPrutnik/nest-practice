import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
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

  async signUp(userInfo: CreateUserDto): Promise<{ token: string }> {
    const existedUser = await this.userService.getByEmail(userInfo.email);
    if (existedUser) {
      throw new BadRequestException(
        `User with email ${userInfo.email} is already exist`,
      );
    }
    const hashedPassword = await this.passwordService.hashPassword(
      userInfo.password,
    );
    const newUser = await this.userService.create({
      ...userInfo,
      password: hashedPassword,
    });
    const token = await this.tokenService.create(newUser._id.toString());
    return { token };
  }

  async signIn(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userService.getByEmail(email);
    const isPasswordValid = await this.passwordService.verifyPassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Bad Credentials');
    }
    const token = await this.tokenService.create(user._id.toString());
    return { token };
  }

  async logout(userId: string) {
    // await this.tokenService.remove(userId);
    return;
  }
}
