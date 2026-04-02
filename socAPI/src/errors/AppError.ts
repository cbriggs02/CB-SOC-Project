/**
 * AppError is a custom error class that extends the built-in Error class in JavaScript. It is designed to provide a standardized way to handle errors in the application by including an HTTP status code along with the error message. This allows for more consistent error handling and better communication of error details to clients and developers. The AppError class can be used
 */
export class AppError extends Error {
    statusCode: number;

    /**
     * Creates an instance of AppError.
     * @param message 
     * @param statusCode 
     */
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}