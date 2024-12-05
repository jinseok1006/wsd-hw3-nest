import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TokenService } from "src/token/token.service";
import {
  InvalidTokenException,
  TokenBlacklistedException,
  TokenNotFoundException,
} from "./custom-error";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    request["user"] = { sub: 1 };

    // const token = this.extractTokenFromHeader(request);

    // if (!token) {
    //   // throw new UnauthorizedException("Token not found");
    //   throw new TokenNotFoundException();
    // }

    // if (this.tokenService.isBlacklisted(token)) {
    //   // throw new UnauthorizedException("Token is blacklisted");
    //   throw new TokenBlacklistedException();
    // }

    // try {
    //   const payload = this.jwtService.verify(token, {
    //     secret: process.env.JWT_SECRET,
    //   });
    //   // Attach user information to request object
    //   request["user"] = payload;
    // } catch {
    //   throw new InvalidTokenException();
    // }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authorizationHeader = request.headers["authorization"];
    if (!authorizationHeader) {
      return null;
    }

    const [type, token] = authorizationHeader.split(" ");
    return type === "Bearer" ? token : null;
  }
}
