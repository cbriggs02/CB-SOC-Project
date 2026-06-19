import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { ISecurityLoggerService } from '../interfaces/SecurityLogger/ISecurityLoggerService';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { ServiceNameEnum } from '../enums/ServiceNameEnum';
import { LogLevelEnum } from '../enums/LogLevelEnum';
import { ActionTypeEnum } from '../enums/ActionTypeEnum';
import { env } from '../config/env';
import { EnvironmentTypeEnum } from '../enums/EnvironmentTypeEnum';

/**
 * @description Global error middleware for routing-controllers.
 * Catches all errors thrown in controllers and returns structured JSON.
 */
@Middleware({ type: 'after' })
@injectable()
export class GlobalErrorMiddleware implements ExpressErrorMiddlewareInterface {
    /**
     * @description Initializes the GlobalErrorMiddleware with the necessary services for logging errors. The ISecurityLoggerService is injected to allow for logging of errors that occur within the application, which can be useful for monitoring and debugging purposes.
     * @param securityLogger - The service responsible for logging security-related events, such as system errors. This service is used to log important information about errors that occur in the application, which can help with troubleshooting and improving the overall security posture of the application.
     */
    constructor(@inject(DIContainerTokensEnum.ISecurityLoggerService) private readonly securityLogger: ISecurityLoggerService) {}

    /**
     * @description Express error handling middleware function that catches errors thrown in controllers and returns a structured JSON response. It also logs the error details using the ISecurityLoggerService for monitoring and debugging purposes.
     * @param err - The error object that was thrown in the controller. This object can contain various properties, such as message, statusCode, and errors (for validation errors), which are used to construct the response and log the error details.
     * @param req - The Express request object, which contains information about the incoming HTTP request, such as the method, originalUrl, and headers. This information is used to build the security log entry for the error.
     * @param res - The Express response object, which is used to send the structured JSON response back to the client with the appropriate HTTP status code and error message.
     * @param next - The next middleware function in the Express middleware stack. This parameter is not used in this error handling middleware, but it is included to conform to the Express middleware signature.
     */
    public async error(err: any, req: Request, res: Response, next: NextFunction): Promise<void> {
        const { statusCode, message, errors } = this.getErrorInfo(err);
        const logPayload = this.buildSecurityLog(req, err, statusCode, message);

        await this.sendSecurityLog(logPayload);
        res.status(statusCode).json(this.buildHttpResponse(statusCode, message, errors));
    }

    private getErrorInfo(err: any) {
        const statusCode = err.httpCode || err.statusCode || 500;
        const isValidationError = Array.isArray(err.errors);

        const message = isValidationError ? 'Validation failed' : err.message || 'Internal server error';
        const errors = err.errors ? err.errors.flatMap((e: any) => (e.constraints ? Object.values(e.constraints) : [])) : [];

        return { statusCode, isValidationError, message, errors };
    }

    private buildSecurityLog(req: Request, err: any, statusCode: number, message: string) {
        return {
            method: req.method,
            path: req.originalUrl,
            statusCode,
            message,
            errorName: err?.name || 'Error',
        };
    }

    private async sendSecurityLog(payload: any): Promise<void> {
        this.securityLogger
            .createSecurityLog({
                ServiceName: ServiceNameEnum.API,
                LogLevel: LogLevelEnum.ERROR,
                ActionType: ActionTypeEnum.SystemError,
                Message: JSON.stringify(payload),
            })
            .catch((err) => {
                if (env.ENV !== EnvironmentTypeEnum.PRODUCTION) {
                    console.error('Security log failed:', err);
                }
            });
    }

    private buildHttpResponse(statusCode: number, message: string, errors: string[]) {
        return {
            success: false,
            status: statusCode,
            message,
            errors: errors || [],
        };
    }
}
