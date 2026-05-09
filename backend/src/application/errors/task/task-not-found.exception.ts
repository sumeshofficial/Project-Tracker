import { AppException } from "@shared/errors/app.exception.js";
import { ErrorCodes } from "@shared/errors/error-codes.js";

export class TaskNotFoundException extends AppException {
    constructor() {
        super(ErrorCodes.TASK_NOTFOUD, 404);
    }
}