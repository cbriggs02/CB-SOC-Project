import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { LogLevelEnum } from '../enums/LogLevelEnum';
import { ActionTypeEnum } from '../enums/ActionTypeEnum';
import { ServiceNameEnum } from '../enums/ServiceNameEnum';
import { inject, injectable } from 'tsyringe';
import { ISecurityLoggerService } from '../interfaces/SecurityLogger/ISecurityLoggerService';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { EnvironmentTypeEnum } from '../enums/EnvironmentTypeEnum';
import { env } from '../config/env';

/**
 * @description RequestLoggerMiddleware is an Express middleware that logs details about each incoming HTTP request, including the method, URL, response status code, and duration of the request. It uses the SecurityLoggerService to create security logs for each request, which can be sent to a SIEM system for monitoring and analysis. This middleware enhances the application's logging capabilities by providing detailed information about incoming requests, which can be useful for debugging, performance monitoring, and security auditing.
 */
@injectable()
export class RequestLoggerMiddleware {
    /**
     * @description Constructor for the RequestLoggerMiddleware class. It injects the ISecurityLoggerService for logging request details.
     * @param securityLogger - The service responsible for logging security-related events, such as HTTP requests. This service is used to create security logs for each incoming HTTP request, which can be sent to a SIEM system for monitoring and analysis. The logs include details such as the request method, URL, response status code, and duration of the request, which can be useful for debugging, performance monitoring, and security auditing purposes.
     */
    constructor(@inject(DIContainerTokensEnum.ISecurityLoggerService) private readonly securityLogger: ISecurityLoggerService) {}

    /**
     * @description Logs details about each incoming HTTP request.
     * @param req - The Express request object, which contains information about the incoming HTTP request, such as the method and original URL. This information is used to construct the log message that will be sent to the SecurityLoggerService.
     * @param res - The Express response object, which is used to listen for the 'finish' event to determine when the response has been sent. This allows the middleware to calculate the duration of the request and include it in the log message.
     * @param next - The next middleware function in the Express middleware stack. This parameter is used to pass control to the next middleware function after setting up the logging for the request.
     */
    public use = async (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();

        res.on('finish', async () => {
            const duration = Date.now() - start;
            const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

            this.securityLogger
                .createSecurityLog({
                    ServiceName: ServiceNameEnum.API,
                    LogLevel: LogLevelEnum.INFO,
                    ActionType: ActionTypeEnum.HttpRequest,
                    Message: logMessage,
                })
                .catch((err) => {
                    if (env.ENV !== EnvironmentTypeEnum.PRODUCTION) {
                        console.error('Request logging failed', err);
                    }
                });
        });
        next();
    };
}
