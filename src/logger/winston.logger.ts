// src/logger/winston.logger.ts
import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";

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

export const consoleTransport = new winston.transports.Console({
  level: "silly",
  format: winston.format.combine(
    winston.format.timestamp(),
    nestWinstonModuleUtilities.format.nestLike("MyApp", {
      prettyPrint: true,
    })
  ),
  
});
