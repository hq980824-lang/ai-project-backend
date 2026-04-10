import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { SignJWT, importPKCS8 } from 'jose';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { HefengIndicesEntity } from './entities/hefeng-indices.entity';
import { HefengIndecesVo } from './vo/hefeng-indeces.vo';

@Injectable({ scope: Scope.REQUEST })
export class HefengService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(HefengIndicesEntity)
    private readonly indicesRepo: Repository<HefengIndicesEntity>,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  /** 服务器本地日历日 YYYY-MM-DD（用于判断是否走 1d） */
  private localYmd(): string {
    const n = new Date();
    const y = n.getFullYear();
    const m = String(n.getMonth() + 1).padStart(2, '0');
    const d = String(n.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * 和风路径仅支持 1d/3d：当天用 1d，其它日期用 3d 再在内存里按 date 过滤。
   */
  private pickIndicesPath(requestDate: string): '1d' | '3d' {
    return requestDate === this.localYmd() ? '1d' : '3d';
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

  async getIndicesByDate(
    cityId: string,
    date: string,
    typeParam?: string,
  ): Promise<HefengIndecesVo[]> {
    const token = this.getClientToken();
    const baseUrl = this.config.get<string>('HEFENG_BASE_URL');
    const types = (typeParam?.trim() || '1,2').replace(/\s/g, '');
    const daysPath = this.pickIndicesPath(date);

    const res = await firstValueFrom(
      this.httpService.get(`${baseUrl}/v7/indices/${daysPath}`, {
        params: { location: cityId, type: types },
        headers: token ? { Authorization: token } : {},
      }),
    );

    const body = res.data as {
      code?: string;
      daily?: HefengIndecesVo[];
    };
    if (body.code !== '200') {
      throw new BadRequestException(
        `和风指数接口异常：code=${body.code ?? 'unknown'}`,
      );
    }

    const daily = (body.daily ?? []).filter((item) => item.date === date);
    if (daily.length > 0) {
      const now = new Date();
      const rows = daily.map((item) => ({
        location: cityId,
        forecastDate: item.date,
        type: item.type,
        name: item.name,
        level: item.level,
        category: item.category,
        text: item.text ?? null,
        updatedAt: now,
      }));
      await this.indicesRepo.manager
        .createQueryBuilder()
        .insert()
        .into(HefengIndicesEntity)
        .values(rows)
        .orUpdate(
          ['name', 'level', 'category', 'text', 'updated_at'],
          ['location', 'forecast_date', 'type'],
        )
        .updateEntity(false)
        .execute();
    }

    return daily;
  }
}
