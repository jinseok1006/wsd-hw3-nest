import { applyDecorators } from "@nestjs/common";
import {
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ErrorResponseDto } from "./response.dto";

export function ApiCommonErrorResponses(options: {
  conflict?: boolean;
  badRequest?: boolean;
  notFound?: boolean;
  unauthorized?: boolean;
} = {}) {
  const decorators = [];

  if (options.conflict) {
    decorators.push(
      ApiConflictResponse({
        type: ErrorResponseDto,
        description: "Conflict",
        example: {
          success: false,
          message: ["error message"],
          error: "Conflict",
          statusCode: 409,
        },
      })
    );
  }

  if (options.badRequest) {
    decorators.push(
      ApiBadRequestResponse({
        type: ErrorResponseDto,
        description: "Bad Request",
        example: {
          success: false,
          message: ["error message"],
          error: "Bad Request",
          statusCode: 400,
        },
      })
    );
  }

  if (options.notFound) {
    decorators.push(
      ApiNotFoundResponse({
        type: ErrorResponseDto,
        description: "Not Found",
        example: {
          success: false,
          message: ["error message"],
          error: "Not Found",
          statusCode: 404,
        },
      })
    );
  }

  if (options.unauthorized) {
    decorators.push(
      ApiUnauthorizedResponse({
        type: ErrorResponseDto,
        description: "Unauthorized",
        example: {
          success: false,
          message: ["error message"],
          error: "Unauthorized",
          statusCode: 401,
        },
      })
    );
  }

  return applyDecorators(...decorators);
}
