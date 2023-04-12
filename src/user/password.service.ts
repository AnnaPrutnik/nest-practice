import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

  hashPassword(password: string): Promise<string> {
    const salt = Number(this.configService.get<string>('SALT_ROUNDS'));
    return bcrypt.hash(password, salt);
  }

  verifyPassword(userPassword, dbPassword): Promise<boolean> {
    return bcrypt.compare(userPassword, dbPassword);
  }
}
