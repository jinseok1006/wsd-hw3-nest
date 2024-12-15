import {
  Injectable,
  ExecutionContext,
  Inject,
  LoggerService,
} from "@nestjs/common";
import { CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import { CacheKeyHelper } from "./cache-key-helper";
import { Reflector } from "@nestjs/core";
import { Cache } from "cache-manager";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class UserCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    reflector: Reflector,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {
    super(cacheManager, reflector);
  }
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    // GET 요청만 캐싱
    if (request.method !== "GET") {
      return undefined;
    }

    // 사용자 ID 기반 캐시 키 생성
    if (request.user && request.user.sub) {
      const key = CacheKeyHelper.generateKey(
        request.method,
        request.url,
        request.user.sub
      );
      // console.log(`[CACHE DEBUG] Generated user-specific cache key: ${key}`);
      this.logger.debug({
        message: `Generated user-specific cache key: ${handler.name}`,
        context: UserCacheInterceptor.name,
      });
      return key;
    }

    // 사용자 ID가 없는 요청은 캐싱하지 않음
    // console.log(`[CACHE DEBUG] No user ID found, skipping cache.`);
    this.logger.debug({
      message: `No user ID found, skipping cache: ${handler.name}`,
      context: UserCacheInterceptor.name,
    });
    return undefined;
  }
}
