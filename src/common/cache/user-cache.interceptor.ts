import { Injectable, ExecutionContext } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { CacheKeyHelper } from "./cache-key-helper";

@Injectable()
export class UserCacheInterceptor extends CacheInterceptor {
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
