/**
 * @description This file defines a constant object `ERROR_MESSAGES` that contains standardized error messages for various scenarios related to
 * user management and password operations. The error messages are organized into categories such as USER, PASSWORD, and GENERAL
 * for better structure and maintainability. Each category contains specific error messages that can be used throughout the application
 * to ensure consistency in error handling and logging.
 */
export const ERROR_MESSAGES = {
    USER: {
        NOT_FOUND: 'User not found',
        INVALID_ID: 'Invalid user ID format',
    },
    PASSWORD: {
        PASSWORD_OPERATION_FAILURE: 'Password operation failed',
        MIN_LENGTH: 'Password must be at least 8 characters long',
        UPPERCASE: 'Password must contain an uppercase letter',
        DIGITS: 'Password must contain a number',
        SYMBOLS: 'Password must contain a special character',
        DEFAULT: 'Password does not meet the requirements',
    },
    AUTHENTICATION: {
        TOKEN_VERIFICATION_FAILED: 'Token verification failed',
    },
    GENERAL: {
        INTERNAL_ERROR: 'Internal server error',
    },
} as const;
