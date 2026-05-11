import { AppException } from "@shared/errors/app.exception";
import { ErrorCodes } from "@shared/errors/error-codes";

export class UnauthorizedException extends AppException {
  constructor() {
    super(ErrorCodes.UNAUTHORIZED, 401);
  }
}