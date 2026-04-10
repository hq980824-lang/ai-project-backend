import { Injectable, Inject, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignJWT, importPKCS8 } from 'jose';
import { HefengIndecesVo } from './vo/hefeng-indeces.vo';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable({ scope: Scope.REQUEST })
export class HefengService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  /** 控制台分配的 Host，无协议时补 https:// */
  private resolveApiBaseUrl(hostOrUrl: string): string {
    const t = hostOrUrl.trim();
    if (!t) return '';
    if (t.startsWith('http://') || t.startsWith('https://')) {
      return t.replace(/\/$/, '');
    }
    return `https://${t.replace(/\/$/, '')}`;
  }

  /**
   * 获取前端传过来的 Token
   */
  getClientToken(): string | null {
    const auth = this.req.headers.authorization;
    if (!auth) return null;
    return auth;
  }

  /**
   * 生成和风天气 JWT
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

    const token = await new SignJWT({ sub, iat, exp })
      .setProtectedHeader({ alg, kid })
      .sign(key);

    return `Bearer ${token}`;
  }

  async getIndicesByDays(
    cityId: string,
    days: string,
  ): Promise<HefengIndecesVo[]> {
    const token = this.getClientToken();
    const baseUrl = this.resolveApiBaseUrl(
      this.config.get<string>('HEFENG_BASE_URL') ?? '',
    );

    const res = await firstValueFrom(
      this.httpService.get(`${baseUrl}/v7/indices/${days}`, {
        params: { location: cityId, type: '1,2' },
        headers: token ? { Authorization: token } : {},
      }),
    );

    return res.data.daily;
  }
}
