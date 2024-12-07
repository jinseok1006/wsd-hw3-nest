import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { WinstonModule } from "nest-winston";
import { winstonOption } from "./logger/winston.logger";
import { ConfigModule } from "@nestjs/config";
import { JobsModule } from "./jobs/jobs.module";
import { BookmarksModule } from "./bookmarks/bookmarks.module";
import { ApplicationsModule } from "./applications/applications.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GlobalCacheInterceptor } from "./common/cache/global-cache.interceptor";
import { MetadataModule } from './metadata/metadata.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
    }),
    WinstonModule.forRoot(winstonOption), // 토큰을 이용한 전역 Provider
    AuthModule,
    JobsModule,
    BookmarksModule,
    ApplicationsModule,
    ReviewsModule,
    MetadataModule,
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
