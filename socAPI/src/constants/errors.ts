/**
 * This file defines a set of constant error messages that can be used throughout the application to 
 * provide consistent and clear error responses. These constants help to avoid hardcoding error messages in multiple places,
 * making it easier to manage and maintain the codebase. Each error message corresponds to a specific type of error that 
 * may occur during user operations, such as when a user is not found, when an invalid user ID format is provided, when a 
 * request is invalid, or when an internal server error occurs.
 */
export const ERRORS = {
    USER_NOT_FOUND: "User not found",
    INVALID_USER_ID: "Invalid user ID format",
    INVALID_REQUEST: "Invalid request",
    PASSWORD_OPERATION_FAILURE: "Password operation failed",
    INTERNAL_ERROR: "Internal server error",
};