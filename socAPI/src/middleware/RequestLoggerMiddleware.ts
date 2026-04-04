import { Request, Response, NextFunction } from "express";
import { SecurityLoggerService } from "../services/Security/SecurityLoggerService";
import { LogLevelEnum } from "../enums/LogLevelEnum";
import { ActionTypeEnum } from "../enums/ActionTypeEnum";
import { ServiceNameEnum } from "../enums/ServiceNameEnum";

/**
 * RequestLoggerMiddleware is an Express middleware that logs details about each incoming HTTP request, including the method, URL, response status code, and duration of the request. It uses the SecurityLoggerService to create security logs for each request, which can be sent to a SIEM system for monitoring and analysis. This middleware enhances the application's logging capabilities by providing detailed information about incoming requests, which can be useful for debugging, performance monitoring, and security auditing.
 */
export class RequestLoggerMiddleware {
    private securityLogger = new SecurityLoggerService();

    /**
     * Logs details about each incoming HTTP request.
     * @param req 
     * @param res 
     * @param next 
     */
    public use = async (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();

        res.on("finish", async () => {
            const duration = Date.now() - start;
            const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

            this.securityLogger.createSecurityLog({
                ServiceName: ServiceNameEnum.API,
                LogLevel: LogLevelEnum.INFO,
                ActionType: ActionTypeEnum.HttpRequest,
                Message: logMessage
            }).catch(err => console.error("Request logging failed", err));
        });
        next();
    };
}