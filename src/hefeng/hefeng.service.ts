import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignJWT, importPKCS8 } from 'jose';

@Injectable()
export class HefengService {
  constructor(private readonly config: ConfigService) {}

  /**
   * 按和风文档生成 JWT：Header alg=EdDSA、kid；Payload sub=项目ID、iat、exp。
   * @see https://dev.qweather.com/docs/configuration/authentication/
   */
  async getQweatherJwt(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    const alg = this.config.get<string>('HEFENG_ALG')!;
    const kid = this.config.get<string>('HEFENG_KID')!;
    const sub = this.config.get<string>('HEFENG_SUB')!;
    const privateKey = this.config.get<string>('HEFENG_PRIVATE_KEY')!;

    const iat = now - 30;
    const exp = iat + 30 * 60;

    const key = await importPKCS8(privateKey, alg);

    const Header = {
      alg,
      kid,
    };

    const Payload = {
      sub,
      iat,
      exp,
    };

    const token = await new SignJWT(Payload).setProtectedHeader(Header).sign(key);

    return `Bearer ${token}`;
  }
}
