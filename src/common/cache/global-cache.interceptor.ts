import { Injectable, ExecutionContext} from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { CacheKeyHelper } from "./cache-key-helper";

@Injectable()
export class GlobalCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const handler = context.getHandler();

    // 메타데이터로 캐싱 우회 확인
    if (Reflect.getMetadata("skip-global-cache", handler)) {
      console.log(
        `[CACHE DEBUG] Skipping global cache for handler: ${handler.name}`
      );
      return undefined;
    }

    const request = context.switchToHttp().getRequest();

    // GET 요청만 캐싱
    if (request.method !== "GET") {
      return undefined;
    }
    // URL 기반 키 생성
    const key = CacheKeyHelper.generateKey(request.method, request.url);
    console.log(`[CACHE DEBUG] Generated global cache key: ${key}`);
    return key;
  }

    
}
