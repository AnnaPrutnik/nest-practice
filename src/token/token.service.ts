import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Token } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(userId: string) {
    const token = await this.jwtService.signAsync({ id: userId });
    return token;
  }

  async verify(token: string): Promise<{ id: string } | null> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    if (!payload) {
      return null;
    }
    return payload;
  }

  update(id: number) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
