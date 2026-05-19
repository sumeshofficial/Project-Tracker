import { HttpStatusCode } from "@shared/constants/http-status";

export const TASK_MESSAGES = {
    TASK_CREATED_SUCCESSFULLY:
        'Task created successfully.',
    TASKS_FETCHED_SUCCESSFULLY: 'Tasks fetched successfully',
    TASK_FETCHED_SUCCESSFULLY: 'Task fetched successfully',
    TASK_UPDATED_SUCCESSFULLY: "Task updated successfully",
};

export const TASK_CONSTANTS = {
    MESSAGES: TASK_MESSAGES,
    CODES: HttpStatusCode,
};