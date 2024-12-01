import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { LoggerMiddleware } from "./common/logger.middleware";
import { AppController } from "./app.controller";

import { LoggerModule } from "./logger/logger.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
// import { winstonLogger } from "./logger/winston.logger";
import { WinstonModule } from "nest-winston";

@Module({
  imports: [
    PrismaModule,
    // WinstonModule.forRoot({ transports: [consoleTransport] }),
  ],
  controllers: [AppController],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes("*");
  // }
}
