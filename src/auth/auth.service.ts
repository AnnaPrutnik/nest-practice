import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private createToken(id: string) {
    const token = this.jwtService.sign({ id });
    this.userService.setToken(id, token);
    return token;
  }

  async signUp(userInfo: CreateUserDto): Promise<{ token: string }> {
    const existedUser = await this.userService.getByEmail(userInfo.email);
    if (existedUser) {
      throw new BadRequestException(
        `User with email ${userInfo.email} is already exist`,
      );
    }

    const newUser = await this.userService.create(userInfo);
    const token = this.createToken(newUser._id.toString());
    return { token };
  }

  async signIn(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userService.getByEmail(email);
    const isPasswordValid = await user?.isValidPassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Bad Credentials');
    }
    const token = this.createToken(user._id.toString());
    return { token };
  }

  async logout(id: string) {
    return await this.userService.removeToken(id);
  }
}
