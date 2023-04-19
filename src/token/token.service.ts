import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Token } from './schemas/token.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async generateTokens(userId: string) {
    const accessToken = await this.jwtService.signAsync({ id: userId });
    const refreshToken = await randomBytes(16).toString('hex');
    return { accessToken, refreshToken };
  }

  private expireTokenDate() {
    const today = new Date();
    const expireIn = Number(this.configService.get<number>('REFRESH_EXPIRE'));
    return new Date(new Date().setDate(today.getDate() + expireIn));
  }

  private async saveRefreshToken(token, userId, userAgent) {
    const expires = this.expireTokenDate();
    const data: Token = {
      refreshToken: token,
      expires,
      userAgent,
      userId,
    };
    await this.tokenModel.create(data);
    return;
  }

  private verifyRefreshToken(expires: Date, userAgent: string) {
    const isExpireToken = expires < new Date();
    const isSameUserAgent = userAgent === userAgent;
    if (isExpireToken || !isSameUserAgent) {
      return false;
    }
    return true;
  }

  async create(userId: string, userAgent: string) {
    //TODO: check if user logged in from this device???
    const { refreshToken, accessToken } = await this.generateTokens(userId);
    await this.saveRefreshToken(refreshToken, userId, userAgent);
    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<{ id: string } | null> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    if (!payload) {
      return null;
    }
    return payload;
  }

  async updateRefreshToken(refreshToken: string, userAgent: string) {
    console.log(refreshToken);
    const tokenDoc = await this.tokenModel.findOne({ refreshToken }).lean();
    console.log('tokenDoc before', tokenDoc);
    if (!tokenDoc) {
      return null;
    }
    const isValidToken = this.verifyRefreshToken(tokenDoc.expires, userAgent);
    if (!isValidToken) {
      return null;
    }
    const tokens = await this.generateTokens(tokenDoc.userId.toString());

    const expires = this.expireTokenDate();
    console.log('tokenDoc after', tokenDoc);
    await this.tokenModel.findByIdAndUpdate(tokenDoc._id, {
      expires,
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }

  async removeRefreshToken(userId: string, userAgent: string) {
    const record = await this.tokenModel.findOne({ userId, userAgent });
    if (record) {
      await this.tokenModel.findByIdAndRemove(record._id);
    }
    return;
  }
}
