import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { ISecurityLoggerService } from '../interfaces/SecurityLogger/ISecurityLoggerService';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { ServiceNameEnum } from '../enums/ServiceNameEnum';
import { LogLevelEnum } from '../enums/LogLevelEnum';
import { ActionTypeEnum } from '../enums/ActionTypeEnum';

/**
 * @description Global error middleware for routing-controllers.
 * Catches all errors thrown in controllers and returns structured JSON.
 */
@Middleware({ type: 'after' })
@injectable()
export class GlobalErrorMiddleware implements ExpressErrorMiddlewareInterface {
    /**
     * @description Constructor for the global error middleware.
     * @param securityLogger
     */
    constructor(
        @inject(DIContainerTokensEnum.ISecurityLoggerService)
        private readonly securityLogger: ISecurityLoggerService,
    ) {}

    /**
     * @description Handles errors thrown in the application.
     * @param err
     * @param req
     * @param res
     * @param next
     */
    public async error(err: any, req: Request, res: Response, next: NextFunction): Promise<void> {
        const statusCode = err.httpCode || err.statusCode || 500;
        const message = err.message || null;

        const logMessage = `[ERROR] ${req.method} ${req.originalUrl} - ${statusCode} - ${message} - ${err.stack || 'No stack'}`;
        this.securityLogger
            .createSecurityLog({
                ServiceName: ServiceNameEnum.API,
                LogLevel: LogLevelEnum.ERROR,
                ActionType: ActionTypeEnum.SystemError,
                Message: logMessage,
            })
            .catch(console.error);

        res.status(statusCode).json({
            success: false,
            status: statusCode,
            message,
            errors: err.errors || null,
        });
    }
}
