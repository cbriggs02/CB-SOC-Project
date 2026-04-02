/**
 * Enum representing the various levels of logging severity.
 */
export enum LogLevelEnum {
    /**
     * Represents an error log level.
     * Typically used for critical issues that require immediate attention.
     */
    Error = 'error',

    /**
     * Represents a critical log level.
     * Used for severe issues that may cause the application to crash or lead to significant problems.
     */
    Critical = 'critical',

    /**
     * Represents an informational log level.
     * Used for general information about the application's flow and state.
     */
    Info = 'info',

    /**
     * Represents a warning log level.
     * Used to indicate potentially problematic situations that are not errors but should be monitored.
     */
    Warning = 'warn',
}
