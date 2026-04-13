import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { UsersModule } from './users/users.module.js';
import { UploadModule } from './upload/upload.module';
import { HefengModule } from './hefeng/hefeng.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';

/** 与 dist 同级，避免 PM2 工作目录不是项目根时读不到 .env */
const envRoot = join(__dirname, '..');
const nodeEnv = process.env.NODE_ENV ?? 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(envRoot, `.env.${nodeEnv}`), join(envRoot, '.env')],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<number>('JWT_EXPIRES_IN') },
      }),
      global: true
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const username = config.get<string>('DB_USERNAME');
        if (!username?.trim()) {
          throw new Error(
            'DB_USERNAME 未配置。生产环境请设置 NODE_ENV=production 并确保项目根目录存在 .env.production 或 .env（含 DB_HOST / DB_USERNAME / DB_PASSWORD / DB_DATABASE）。',
          );
        }
        return {
          type: 'mysql',
          host: config.get<string>('DB_HOST', '127.0.0.1'),
          port: config.get<number>('DB_PORT', 3306),
          username,
          password: config.get<string>('DB_PASSWORD', ''),
          database: config.get<string>('DB_DATABASE', ''),
          autoLoadEntities: true,
          synchronize: nodeEnv === 'development',
        };
      },
    }),
    UsersModule,
    UploadModule,
    HefengModule,
    RedisModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
