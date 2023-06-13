import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { DateTime } from 'luxon';
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
    const today = DateTime.now();
    const expireIn = Number(this.configService.get<number>('REFRESH_EXPIRE'));
    return today.plus({ days: expireIn }).toJSDate();
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

  private verifyRefreshToken(
    tokenDoc: Token & { _id: Types.ObjectId },
    userAgent: string,
  ) {
    const today = DateTime.now();
    const end = DateTime.fromJSDate(tokenDoc.expires);

    const isExpireToken = today > end;

    const isSameUserAgent = userAgent === tokenDoc.userAgent;
    if (isExpireToken || !isSameUserAgent) {
      return false;
    }
    return true;
  }

  async create(userId: string, userAgent: string) {
    const existedToken = await this.tokenModel.findOne({ userId, userAgent });
    if (existedToken) {
      await this.tokenModel.findByIdAndDelete(existedToken._id);
    }
    const { refreshToken, accessToken } = await this.generateTokens(userId);
    await this.saveRefreshToken(refreshToken, userId, userAgent);
    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<{ id: string }> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async updateRefreshToken(refreshToken: string, userAgent: string) {
    const tokenDoc = await this.tokenModel.findOne({ refreshToken }).lean();
    if (!tokenDoc) {
      return null;
    }

    const isValidToken = this.verifyRefreshToken(tokenDoc, userAgent);

    if (!isValidToken) {
      return null;
    }

    const tokens = await this.create(tokenDoc.userId.toString(), userAgent);
    return tokens;
  }

  async removeRefreshToken(userId: string, userAgent: string) {
    await this.tokenModel.findOneAndRemove({
      userId,
      userAgent,
    });
    return;
  }
}
