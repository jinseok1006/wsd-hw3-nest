import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";
import { AuthCoreModule } from "src/auth-core/auth-core.module";

@Module({
  imports: [PrismaModule, UsersModule, AuthCoreModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
