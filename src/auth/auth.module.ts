import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { TokenService } from "./token.service";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    {
      provide: WINSTON_MODULE_NEST_PROVIDER,
      useValue: console, // 실제로는 winston logger를 설정해야 합니다.
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
