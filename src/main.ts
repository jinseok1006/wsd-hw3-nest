import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./exception/http-exception.filter";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaExceptionFilter } from "./exception/prisma-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useGlobalFilters(
    new HttpExceptionFilter(logger),
    new PrismaExceptionFilter(logger),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        // enableImplicitConversion: true,
      },
    })
  );

  // app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("NestJS API")
    .setDescription("NestJS API documentation with Swagger")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI를 '/api-docs' 경로에서 제공
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(3000);
}

bootstrap();
