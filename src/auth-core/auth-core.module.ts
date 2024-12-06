import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TokenModule } from "src/token/token.module";

@Module({
  imports: [
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
  exports: [JwtModule,TokenModule],
})
export class AuthCoreModule {}
