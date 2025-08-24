import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization
      ignoreExpiration: false,
      secretOrKey: 'AEgQuKuIYQteQymBpMtAj6NgY4sDH9StTjnrm9jxqz506wdwACO88gAsUGpsjqQW', // Khóa bí mật của bạn
    });
  }
  async validate(payload: any) {    
    // payload chính là dữ liệu bạn đã ký khi tạo token
    // Ví dụ: { sub: userId, username: 'abc' }
    return { ...payload };
  }
}
