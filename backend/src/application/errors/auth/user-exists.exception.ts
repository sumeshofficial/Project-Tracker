import { AppException } from "@shared/errors/app.exception";
import { ErrorCodes } from "@shared/errors/error-codes";

export class UserExistsException extends AppException {
    constructor() {
        super(ErrorCodes.USER_EXISTS, 409);
    }
}