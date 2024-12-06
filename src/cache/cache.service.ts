import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Injectable, LoggerService } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Cache } from "cache-manager";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { CacheKeyHelper } from "src/common/cache/cache-key-helper";

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  // 기본 캐시 설정
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  // 기본 캐시 조회
  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  // 기본 캐시 삭제
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // 패턴에 맞는 키 삭제
  async deleteKeysByPattern(pattern: string): Promise<void> {
    const redisClient = (this.cacheManager.store as any).getClient();
    const keys: string[] = [];
    let cursor = "0"; // SCAN 시작점

    this.logger.debug({
      message: `Deleting keys by pattern: ${pattern}`,
      context: CacheService.name,
    });

    try {
      // SCAN 명령 콜백을 Promise로 래핑
      const scanAsync = (cursor: string, pattern: string) =>
        new Promise<{ cursor: string; keys: string[] }>((resolve, reject) => {
          redisClient.scan(
            cursor,
            "MATCH",
            pattern,
            "COUNT",
            "100",
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                const [newCursor, foundKeys] = result;
                resolve({ cursor: newCursor, keys: foundKeys });
              }
            }
          );
        });

      // SCAN 명령 호출 (비동기)
      do {
        const result = await scanAsync(cursor, pattern);
        cursor = result.cursor; // 다음 SCAN 커서
        keys.push(...result.keys); // 발견된 키 추가
      } while (cursor !== "0");

      // 키 삭제
      if (keys.length > 0) {
        await Promise.all(
          keys.map((key: string) => this.cacheManager.del(key))
        );
      }

      this.logger.debug(`Deleted keys: ${keys.length}`);
    } catch (error) {
      this.logger.error(
        `Error while deleting keys by pattern: ${pattern}`,
        error.stack
      );
      throw error;
    }
  }

  // 프로필 캐시 무효화
  async invalidateProfileCache(userId: number): Promise<void> {
    const key = CacheKeyHelper.generateKey("GET", "/auth/profile", userId);
    this.logger.debug({
      message: `[CACHE DEBUG] Cache cleared for key: ${key}`,
    });
    await this.del(key);
  }

  // 지원서 캐시 무효화
  async invalidateApplicationsCache(userId: number): Promise<void> {
    const key = CacheKeyHelper.generateKey("GET", "/applications?*", userId);
    this.logger.debug({
      message: `[CACHE DEBUG] Cache cleared for key: ${key}`,
    });
    await this.deleteKeysByPattern(key);
  }

  // 북마크 캐시 무효화
  async invalidateBookmarksCache(userId: number): Promise<void> {
    const key = CacheKeyHelper.generateKey("GET", "/bookmarks?*", userId);
    this.logger.debug({
      message: `[CACHE DEBUG] Cache cleared for key: ${key}`,
    });
    await this.deleteKeysByPattern(key);
  }

  // 리뷰 캐시 무효화
  async invalidateReviewsCache(companyId: number): Promise<void> {
    const key = CacheKeyHelper.generateKey("GET", "/reviews?*", companyId);
    this.logger.debug({
      message: `[CACHE DEBUG] Cache cleared for key: ${key}`,
    });
    await this.deleteKeysByPattern(key);
  }
}
