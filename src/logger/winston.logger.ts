// src/logger/winston.logger.ts
import * as winston from "winston";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";

// export const winstonLogger = winston.createLogger({
//   level: 'silly',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     nestWinstonModuleUtilities.format.nestLike('MyApp', {
//       prettyPrint: true,
//     }),
//   ),
//   transports: [
//     new winston.transports.Console(),
//     // 필요에 따라 파일로 로그를 저장하는 추가적인 트랜스포트를 설정할 수 있습니다.
//     // new winston.transports.File({ filename: 'combined.log' }),
//   ],
// });

// Custom format similar to common web server log formats
export const winstonLogger = WinstonModule.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "silly",
  transports: [
    // new winston.transports.File({
    //   filename: "application.log", // 로그를 기록할 파일 이름
    //   level: process.env.NODE_ENV === "production" ? "info" : "silly", // 환경에 따른 로그 레벨 설정
    //   format: winston.format.combine(
    //     winston.format.timestamp(), // 타임스탬프 추가
    //     winston.format.json() // JSON 형식으로 포맷
    //   ),
    // }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike("MyApp", {
          colors: true,
          prettyPrint: true,
          processId: true,
          appName: true,
        })
      ),
    }),
  ],
});
