/**
 * @description AppError is a custom error class that extends the built-in Error class in JavaScript. It is designed to provide a standardized way to handle errors in the application by including an HTTP status code along with the error message. This allows for more consistent error handling and better communication of error details to clients and developers. The AppError class can be used
 */
export class AppError extends Error {
    statusCode: number;

    /**
     * @description Creates an instance of AppError.
     * @param message - The error message that describes the error. This message is passed to the base Error class and can be used to provide details about the error that occurred.
     * @param statusCode - The HTTP status code associated with the error. This status code can be used to indicate the type of error (e.g., 400 for Bad Request, 404 for Not Found, 500 for Internal Server Error) and is useful for clients to understand the nature of the error when it is returned in an API response.
     */
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}
