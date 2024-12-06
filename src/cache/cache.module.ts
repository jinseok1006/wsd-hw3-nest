import { Global, Module } from "@nestjs/common";
import {
  CACHE_MANAGER,
  CacheModule as NestCacheModule,
} from "@nestjs/cache-manager";
import { CacheService } from "./cache.service";
import { UserCacheInterceptor } from "src/common/cache/user-cache.interceptor";
import { GlobalCacheInterceptor } from "src/common/cache/global-cache.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import * as redisStore from "cache-manager-redis-store";

// @Module({
//   imports: [
//     CacheModule.registerAsync<Promise<RedisClientOptions>>({
//       isGlobal: true,
//       useFactory: async () => {
//         const store = await redisStore({
//           socket: {
//             host: 'localhost',
//             port: 6379,
//           },
//           ttl: 100, // 여기서 ttl을 설정하면 됩니다.
//         });
//         return {
//           store: () => store,
//         };
//       },
//     }),
//   ],
//   controllers: [AppController],
//   providers: [
//     AppService,
//     {
//       provide: APP_INTERCEPTOR,
//       useClass: CacheInterceptor,
//     },
//   ],
// })

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true, // 전역 캐시 설정
      store: redisStore, // RedisStore 사용
      host: "localhost", // Redis 서버 주소
      port: 6379, // Redis 서버 포트
      ttl: 600, // 기본 TTL 설정 (초 단위)
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
