import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception/http-exception.filter";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaExceptionFilter } from "./exception/prisma-exception.filter";
import { Request, Response } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalFilters(
    new HttpExceptionFilter(app.get(WINSTON_MODULE_PROVIDER)),
    new PrismaExceptionFilter(app.get(WINSTON_MODULE_PROVIDER))
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

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("NestJS API")
    .setDescription("NestJS API documentation with Swagger")
    .setVersion("1.0")
    .addBearerAuth()
    .setExternalDoc("OpenAPI 명세를 JSON 형식으로 보기", "/swagger.json")
    .build();

  const document = SwaggerModule.createDocument(app, config);

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
