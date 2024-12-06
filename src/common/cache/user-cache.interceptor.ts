import { Injectable, ExecutionContext, Inject } from "@nestjs/common";
import { CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import { CacheKeyHelper } from "./cache-key-helper";
import { Reflector } from "@nestjs/core";
import { Cache } from "cache-manager";

@Injectable()
export class UserCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    reflector: Reflector
  ) {
    super(cacheManager, reflector);
  }
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();

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
      console.log(`[CACHE DEBUG] Generated user-specific cache key: ${key}`);
      return key;
    }

    // 사용자 ID가 없는 요청은 캐싱하지 않음
    console.log(`[CACHE DEBUG] No user ID found, skipping cache.`);
    return undefined;
  }
}
