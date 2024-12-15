import {
  Injectable,
  ExecutionContext,
  Inject,
  LoggerService,
} from "@nestjs/common";
import { CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import { CacheKeyHelper } from "./cache-key-helper";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Reflector } from "@nestjs/core";
import { Cache } from "cache-manager";

@Injectable()
export class GlobalCacheInterceptor extends CacheInterceptor {
  constructor(
    protected readonly reflector: Reflector, // Reflector 주입
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache, // CacheManager 주입
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
    super(cacheManager, reflector);
  }
  trackBy(context: ExecutionContext): string | undefined {
    const handler = context.getHandler();

    // 메타데이터로 캐싱 우회 확인
    if (Reflect.getMetadata("skip-global-cache", handler)) {
      this.logger.debug({
        message: `Skipping global cache for handler: ${handler.name}`,
        context: GlobalCacheInterceptor.name,
      });
      return undefined;
    }

    const request = context.switchToHttp().getRequest();

    // GET 요청만 캐싱
    if (request.method !== "GET") {
      return undefined;
    }
    // URL 기반 키 생성
    const key = CacheKeyHelper.generateKey(request.method, request.url);
    this.logger.debug({
      message: `Generated global cache key: ${key}`,
      context: GlobalCacheInterceptor.name,
    });
    return key;
  }
}
