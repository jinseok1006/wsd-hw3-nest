import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

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
    const keys = [];
    let cursor = "0";

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = result.cursor;
      keys.push(...result.keys);
    } while (cursor !== "0");

    if (keys.length > 0) {
      await Promise.all(keys.map((key: string) => this.cacheManager.del(key)));
    }
  }
}
