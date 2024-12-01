import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  // 서버 실행
  // await app.listen(3000, () => {
  //   console.log('Application is running on: http://localhost:3000');
  //   console.log('Swagger UI available at: http://localhost:3000/api-docs');
  // });

  await app.listen(3000);
}

bootstrap();
