import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private configService: ConfigService,
    private userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refresh = request.cookie('');
    if (!refresh) {
      throw new UnauthorizedException();
    }
    try {
      //   const payload = await this.tokenService.verify();
      // const user = await this.userService.getById(payload.id);
      // if (token !== user.token) {
      //   throw new UnauthorizedException();
      // }
      // request.user = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
