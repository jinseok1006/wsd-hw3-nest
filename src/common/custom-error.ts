import {
  BadRequestException,
  ConflictException,
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

export class EmailAlreadyExistsException extends ConflictException {
  constructor(message?: string) {
    super(message || "이미 사용 중인 이메일입니다.");
  }
}

export class ApplicationCancellationException extends BadRequestException {
  constructor(message?: string) {
    super(message || "이 지원 내역은 취소할 수 없습니다.");
  }
}


export class TokenNotFoundException extends UnauthorizedException {
  constructor(message = '토큰이 존재하지 않습니다.') {
    super(message);
  }
}

export class TokenBlacklistedException extends UnauthorizedException {
  constructor(message = '토큰이 블랙리스트에 등록되었습니다.') {
    super(message);
  }
}
