import { Module } from "@nestjs/common";
import { HttpExceptionFilter } from "src/exception/http-exception.filter";
import { LoggerModule } from "src/logger/logger.module";

@Module({
  imports: [
    LoggerModule
  ],


  providers: [
    // Logger,
    {
      provide: "APP_FILTER",
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ExceptionModule {}
