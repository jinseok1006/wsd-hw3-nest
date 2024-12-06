import { Module } from "@nestjs/common";

// import { LoggerModule } from "./logger/logger.module";

import { AuthModule } from "./auth/auth.module";
// import { winstonLogger } from "./logger/winston.logger";
import { WinstonModule } from "nest-winston";
import { winstonOption } from "./logger/winston.logger";
// import { LoggerModule } from './logger/logger.module';
// import { RedisModule } from "./redis/redis.module";
import { ConfigModule } from "@nestjs/config";
import { TokenModule } from "./token/token.module";
import { JobsModule } from "./jobs/jobs.module";
import { BookmarksModule } from "./bookmarks/bookmarks.module";
import { ApplicationsModule } from "./applications/applications.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { CacheModule } from "@nestjs/cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";
import * as redisStore from "cache-manager-redis-store";
import { GlobalCacheInterceptor } from "./common/cache/global-cache.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
    }),
    WinstonModule.forRoot(winstonOption), // 토큰을 이용한 전역 Provider
    AuthModule,
    TokenModule,
    JobsModule,
    BookmarksModule,
    ApplicationsModule,
    ReviewsModule,
    CacheModule.register({
      store: redisStore, // Redis 스토어 사용
      host: "localhost", // Redis 서버 주소
      port: 6379, // Redis 서버 포트
      ttl: 600, // 기본 TTL 설정 (초 단위)
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR, // 전역 인터셉터로 등록
      useClass: GlobalCacheInterceptor,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes("*");
  // }
}
