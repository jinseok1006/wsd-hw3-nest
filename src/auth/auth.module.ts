import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { LoggerModule } from "src/logger/logger.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule, UsersModule,],
  controllers: [AuthController],
})
export class AuthModule {}
  