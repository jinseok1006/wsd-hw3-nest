import { Global, Module } from "@nestjs/common";
import {
  CACHE_MANAGER,
  CacheModule as NestCacheModule,
} from "@nestjs/cache-manager";
import { CacheService } from "./cache.service";
import * as redisStore from "cache-manager-redis-store";
import { UserCacheInterceptor } from "src/common/cache/user-cache.interceptor";
import { GlobalCacheInterceptor } from "src/common/cache/global-cache.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      store: redisStore, // Redis Store 초기화
      host: "localhost",
      port: 6379,
      ttl: 600, // 기본 TTL
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
