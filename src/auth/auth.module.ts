import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { TokenModule } from "src/token/token.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserCacheInterceptor } from "src/common/cache/user-cache.interceptor";

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    TokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule 필요
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"), // ConfigService를 통해 환경 변수 가져오기
        signOptions: {
          expiresIn: "1h",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserCacheInterceptor],
  exports: [AuthService],
})
export class AuthModule {}
