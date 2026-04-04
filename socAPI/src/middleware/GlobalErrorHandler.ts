import { Request, Response, NextFunction } from "express";
import { SecurityLoggerService } from "../services/Security/SecurityLoggerService";
import { LogLevelEnum } from "../enums/LogLevelEnum";
import { ActionTypeEnum } from "../enums/ActionTypeEnum";
import { ServiceNameEnum } from "../enums/ServiceNameEnum";

/**
 * GlobalErrorHandler is an Express middleware that handles errors occurring in the application. It captures details about the error, including the HTTP method, URL, status code, and error message, and logs this information using the SecurityLoggerService. The middleware ensures that all errors are logged for monitoring and analysis while responding to the client with a standardized error message and status code. This helps improve the application's robustness and provides valuable insights for debugging and security auditing.
 */
export class GlobalErrorHandler {
    private securityLogger = new SecurityLoggerService();

    /**
     * Handles global errors in the application.
     * @param err 
     * @param req 
     * @param res 
     * @param next 
     */
    public handle = async (err: any, req: Request, res: Response, next: NextFunction) => {
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        const logMessage = `[ERROR] ${req.method} ${req.originalUrl} - ${statusCode} - ${message} - ${err.stack || "No stack"}`;

        this.securityLogger.createSecurityLog({
            ServiceName: ServiceNameEnum.API,
            LogLevel: LogLevelEnum.Error,
            ActionType: ActionTypeEnum.SystemError,
            Message: logMessage
        }).catch(console.error);

        res.status(statusCode).json({
            status: "error",
            message
        });
    };
}