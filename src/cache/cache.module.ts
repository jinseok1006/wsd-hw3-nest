import { Global, Module } from "@nestjs/common";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { CacheService } from "./cache.service";

import * as redisStore from "cache-manager-redis-store";
import { ConfigModule, ConfigService } from "@nestjs/config";

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
  providers: [CacheService],
  exports: [CacheService, NestCacheModule],
})
export class CacheModule {}
