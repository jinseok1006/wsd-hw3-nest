import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException, Logger } from "@nestjs/common";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    
    // JSON 형식으로 로깅
    const errorLog = {
      context: 'HttpExceptionFilter',
      timestamp: new Date().toISOString(),
      path: req.url,
      error: {
        name: exception.name,
        message: exception.message,
        stack: exception.stack?.split('\n').map(line => line.trim())
      }
    };
    
    this.logger.error(JSON.stringify(errorLog));

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException(exception.message);
    }

    const response = (exception as HttpException).getResponse();
    res.status((exception as HttpException).getStatus()).json(response);
  }
}