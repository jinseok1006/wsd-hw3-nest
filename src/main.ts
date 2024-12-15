import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception/http-exception.filter";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaExceptionFilter } from "./exception/prisma-exception.filter";
import { Request, Response } from "express";
import { PaginationDto, SuccessResponseDto } from "./common/response.dto";
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(WINSTON_MODULE_PROVIDER);

  app.useGlobalFilters(
    new HttpExceptionFilter(logger),
    new PrismaExceptionFilter(logger)
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  // app.useGlobalInterceptors(new ResponseInterceptor());
  
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()), // winston의 info 레벨로 전달
      },
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("NestJS API")
    .setDescription("NestJS API documentation with Swagger")
    .setVersion("1.0")
    .addBearerAuth()
    .setExternalDoc("OpenAPI 명세를 JSON 형식으로 보기", "/swagger.json")
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [SuccessResponseDto, PaginationDto],
  });

  // Swagger UI를 '/swagger' 경로에서 제공
  SwaggerModule.setup("swagger", app, document);

  // 여기서 /swagger.json 경로로 단순 JSON파일을 즉시 제공 하는 코드
  app.use("/swagger.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(document);
  });

  await app.listen(3000);
}

bootstrap();
