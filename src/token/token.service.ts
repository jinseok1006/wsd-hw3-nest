// src/token/token.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  private refreshTokenStore = new Map<string, string>();
  private userRefreshTokenMap = new Map<string, string>();
  private tokenBlacklist = new Set<string>();

  addRefreshToken(token: string, userId: string): void {
    // 기존 리프레시 토큰이 있는 경우 블랙리스트에 추가
    const existingToken = this.userRefreshTokenMap.get(userId);
    if (existingToken) {
      this.tokenBlacklist.add(existingToken);
      this.refreshTokenStore.delete(existingToken);
    }

    // 새로운 리프레시 토큰 저장
    this.refreshTokenStore.set(token, userId);
    this.userRefreshTokenMap.set(userId, token);
  }

  getRefreshToken(token: string): string | undefined {
    return this.refreshTokenStore.get(token);
  }

  deleteRefreshToken(token: string): void {
    const userId = this.refreshTokenStore.get(token);
    if (userId) {
      this.userRefreshTokenMap.delete(userId);
    }
    this.refreshTokenStore.delete(token);
  }

  addToBlacklist(token: string): void {
    this.tokenBlacklist.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}