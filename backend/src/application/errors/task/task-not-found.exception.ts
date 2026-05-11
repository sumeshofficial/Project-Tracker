import { AppException } from "@shared/errors/app.exception";
import { ErrorCodes } from "@shared/errors/error-codes";

export class TaskNotFoundException extends AppException {
    constructor() {
        super(ErrorCodes.TASK_NOTFOUD, 404);
    }
}