import { Injectable,ExecutionContext } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class GlobalCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const handler = context.getHandler();

    // 전역 캐시 우회 여부 확인
    if (Reflect.getMetadata('skip-global-cache', handler)) {
      console.log(`[CACHE DEBUG] Skipping global cache for handler: ${handler.name}`);
      return undefined;
    }

    const request = context.switchToHttp().getRequest();

    // GET 요청만 캐싱
    if (request.method !== 'GET') {
      return undefined;
    }

    // 사용자 ID가 있는 경우, 사용자별 캐시 키 생성
    if (request.user && request.user.sub) {
      const key = `${request.method}:${request.url}:${request.user.sub}`;
      console.log(`[CACHE DEBUG] Generated user-specific cache key: ${key}`);
      return key;
    }

    // 사용자 ID가 없으면 기본 URL 기반 키 사용
    const key = `${request.method}:${request.url}`;
    console.log(`[CACHE DEBUG] Generated global cache key: ${key}`);
    return key;
  }
}
