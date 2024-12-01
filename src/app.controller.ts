import { Controller, Get, Logger } from "@nestjs/common";

// @UseFilters(HttpExceptionFilter)
@Controller()
export class AppController {
  constructor(private readonly logger: Logger) {
    // this.logger.setContext(AppController.name);
  }

  @Get()
  async getHello() {
    // this.logger.error('hello')
    throw new Error("hello error");
    
    // return "hello world!";
  }
}
