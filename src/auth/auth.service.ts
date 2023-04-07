import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.getByEmail(email);

    const isPasswordValid = await user?.isValidPassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Bad Credentials');
    }
    return 'Success';
  }
}
