import { Module } from "@nestjs/common";

// import { LoggerModule } from "./logger/logger.module";

import { AuthModule } from "./auth/auth.module";
// import { winstonLogger } from "./logger/winston.logger";
import { WinstonModule } from "nest-winston";
import { winstonOption } from "./logger/winston.logger";
// import { LoggerModule } from './logger/logger.module';
// import { RedisModule } from "./redis/redis.module";
import { ConfigModule } from "@nestjs/config";


@Module({
  imports: [
    WinstonModule.forRoot(winstonOption),
    AuthModule,
    // RedisModule,
    ConfigModule.forRoot({
      isGlobal: true, // 전역 모듈로 설정
    }),
  ],
  providers: [],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes("*");
  // }
}
