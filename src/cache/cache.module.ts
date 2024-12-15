import { Global, Module } from "@nestjs/common";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { CacheService } from "./cache.service";

import * as redisStore from "cache-manager-redis-store";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GlobalCacheInterceptor } from "src/common/cache/global-cache.interceptor";

@Global()
@Module({
  imports: [
    ConfigModule,
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore, // RedisStore 사용
        host: configService.get<string>("REDIS_HOST", "localhost"), // 환경 변수에서 가져옴
        port: configService.get<number>("REDIS_PORT", 6379), // 환경 변수에서 가져옴
        ttl: 600, // 기본 TTL 설정 (초 단위)
      }),
    }),
  ],
  providers: [
    CacheService,
    {
      provide: APP_INTERCEPTOR, // 전역 인터셉터로 등록
      useClass: GlobalCacheInterceptor,
    },
  ],
  exports: [CacheService, NestCacheModule],
})
export class CacheModule {}
