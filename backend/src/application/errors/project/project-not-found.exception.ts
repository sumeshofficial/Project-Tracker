import { AppException } from "@shared/errors/app.exception";
import { ErrorCodes } from "@shared/errors/error-codes";

export class ProjectNotFoundException extends AppException {
    constructor() {
        super(ErrorCodes.PROJECT_NOTFOUND, 404);
    }
}