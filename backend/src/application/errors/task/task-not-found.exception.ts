import { HttpStatusCode } from "@shared/constants/http-status";
import { AppException } from "@shared/errors/app.exception";
import { ErrorCodes } from "@shared/errors/error-codes";

export class TaskNotFoundException extends AppException {
    constructor() {
        super(ErrorCodes.TASK_NOTFOUD, HttpStatusCode.NOT_FOUND);
    }
}