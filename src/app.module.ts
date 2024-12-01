import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { LoggerMiddleware } from "./common/logger.middleware";
import { AppController } from "./app.controller";

import { ExceptionModule } from "./exception/exception.module";
import { LoggerModule } from './logger/logger.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, 
    ExceptionModule,
     LoggerModule,
     PrismaModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
