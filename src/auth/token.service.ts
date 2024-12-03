// src/auth/token.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  private refreshTokenStore = new Map<string, string>();
  private tokenBlacklist = new Set<string>();

  addRefreshToken(token: string, userId: string): void {
    this.refreshTokenStore.set(token, userId);
  }

  getRefreshToken(token: string): string | undefined {
    return this.refreshTokenStore.get(token);
  }

  deleteRefreshToken(token: string): void {
    this.refreshTokenStore.delete(token);
  }

  addToBlacklist(token: string): void {
    this.tokenBlacklist.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}