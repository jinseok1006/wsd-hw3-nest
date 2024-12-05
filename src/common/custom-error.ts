import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

export class TokenExpiredException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || "토큰이 만료되었습니다.");
  }
}

export class InvalidTokenException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || "유효하지 않은 토큰입니다.");
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || "아이디 또는 비밀번호가 틀렸습니다.");
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor(message?: string) {
    super(message || "사용자를 찾을 수 없습니다.");
  }
}

export class PermissionDeniedException extends ForbiddenException {
  constructor(message?: string) {
    super(message || "권한이 없습니다.");
  }
}

export class EmailAlreadyExistsException extends BadRequestException {
  constructor(message?: string) {
    super(message || "이미 사용 중인 이메일입니다.");
  }
}

export class ApplicationCancellationException extends BadRequestException {
  constructor(message?: string) {
    super(message || "이 지원 내역은 취소할 수 없습니다.");
  }
}

/**
 * 토큰이 요청에 없을 경우 발생하는 예외
 */
export class TokenNotFoundException extends UnauthorizedException {
  constructor(message = 'Token not found') {
    super(message);
  }
}

/**
 * 블랙리스트에 포함된 토큰인 경우 발생하는 예외
 */
export class TokenBlacklistedException extends UnauthorizedException {
  constructor(message = 'Token is blacklisted') {
    super(message);
  }
}
