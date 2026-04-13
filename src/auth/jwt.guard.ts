import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('清先登录');
    }

    try {
      const user = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SERVICE'),
      });
      request.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException('token 无效或已过期');
    }
  }
}
