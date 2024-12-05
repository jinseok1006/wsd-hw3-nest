// src/token/token.service.ts
import { Injectable } from '@nestjs/common';

/**
 * 토큰 서비스: 리프레시 토큰 관리 및 블랙리스트 처리
 * - 리프레시 토큰 저장 및 삭제
 * - 블랙리스트 추가 및 확인
 * - 사용자와 토큰 간의 매핑 관리
 */
@Injectable()
export class TokenService {
  private refreshTokenStore = new Map<string, string>(); // 리프레시 토큰과 사용자 ID 매핑
  private userRefreshTokenMap = new Map<string, string>(); // 사용자 ID와 리프레시 토큰 매핑
  private tokenBlacklist = new Set<string>(); // 블랙리스트 토큰 저장

  /**
   * 리프레시 토큰을 저장합니다.
   * - 기존 리프레시 토큰이 있으면 블랙리스트에 추가
   * - 새 리프레시 토큰으로 업데이트
   * @param token 저장할 리프레시 토큰
   * @param userId 토큰과 연결된 사용자 ID
   */
  addRefreshToken(token: string, userId: string): void {
    // 기존 리프레시 토큰이 있는 경우 처리
    const existingToken = this.userRefreshTokenMap.get(userId);
    if (existingToken) {
      this.tokenBlacklist.add(existingToken); // 기존 토큰을 블랙리스트에 추가
      this.refreshTokenStore.delete(existingToken); // 기존 토큰 삭제
    }

    // 새 리프레시 토큰 저장
    this.refreshTokenStore.set(token, userId);
    this.userRefreshTokenMap.set(userId, token);
  }

  /**
   * 리프레시 토큰으로 사용자 ID를 조회합니다.
   * @param token 조회할 리프레시 토큰
   * @returns 토큰에 연결된 사용자 ID (없을 경우 undefined)
   */
  getRefreshToken(token: string): string | undefined {
    return this.refreshTokenStore.get(token);
  }

  /**
   * 리프레시 토큰을 삭제합니다.
   * - 사용자와의 매핑도 삭제
   * @param token 삭제할 리프레시 토큰
   */
  deleteRefreshToken(token: string): void {
    const userId = this.refreshTokenStore.get(token); // 토큰에 연결된 사용자 ID 조회
    if (userId) {
      this.userRefreshTokenMap.delete(userId); // 사용자-토큰 매핑 삭제
    }
    this.refreshTokenStore.delete(token); // 토큰 삭제
  }

  /**
   * 토큰을 블랙리스트에 추가합니다.
   * @param token 블랙리스트에 추가할 토큰
   */
  addToBlacklist(token: string): void {
    this.tokenBlacklist.add(token);
  }

  /**
   * 토큰이 블랙리스트에 있는지 확인합니다.
   * @param token 확인할 토큰
   * @returns 블랙리스트 여부
   */
  isBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }
}
