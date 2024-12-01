// src/logger/winston.logger.ts
import * as winston from "winston";
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";


// 에러 로그를 기록하는 파일 트랜스포트
const errorFileTransport = new winston.transports.File({
  filename: 'error.log',
  level: 'error', // 'error' 레벨의 로그만 기록
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // JSON 형식으로 기록
  ),
});

// 에러를 제외한 모든 로그를 기록하는 파일 트랜스포트
const accessFileTransport = new winston.transports.File({
  filename: 'access.log',
  level: 'info', // 'info' 이상의 레벨의 로그만 기록
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    // 'error' 레벨을 제외하는 필터 추가
    winston.format((info) => {
      return info.level !== 'error' ? info : false;
    })()
  ),
});

// Custom format similar to common web server log formats
export const winstonLogger = WinstonModule.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "silly",
  transports: [
    // errorFileTransport,
    // accessFileTransport,
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
