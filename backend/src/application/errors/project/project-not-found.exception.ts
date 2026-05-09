import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";

export class ProjectNotFoundException extends AppException {
    constructor() {
        super(ErrorCodes.PROJECT_NOTFOUND, 404);
    }
}