import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const defaultSalt = 8;
@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

  hashPassword(password: string): Promise<string> {
    const salt =
      Number(this.configService.get<string>('SALT_ROUNDS')) || defaultSalt;
    return bcrypt.hash(password, salt);
  }

  verifyPassword(userPassword: string, dbPassword: string): Promise<boolean> {
    if (!userPassword || !dbPassword) {
      return Promise.resolve(false);
    }
    return bcrypt.compare(userPassword, dbPassword);
  }
}
