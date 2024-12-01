import { Logger, Module, Scope } from "@nestjs/common";
import { INQUIRER } from "@nestjs/core";

@Module({
  exports: [Logger],
  providers: [
    {
      provide: Logger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) =>
        new Logger(parentClass.constructor.name),
    },
  ],
})
export class LoggerModule {}
