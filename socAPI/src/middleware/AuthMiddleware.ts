import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { ISecurityLoggerService } from '../interfaces/SecurityLogger/ISecurityLoggerService';
import { IAuthService } from '../interfaces/Authentication/IAuthService';
import { ServiceNameEnum } from '../enums/ServiceNameEnum';
import { ActionTypeEnum } from '../enums/ActionTypeEnum';
import { LogLevelEnum } from '../enums/LogLevelEnum';

/**
 * @description AuthMiddleware is an Express middleware that protects routes by verifying JWT tokens. It checks for the presence of a Bearer token in the Authorization header, verifies the token using the IAuthService, and attaches the decoded payload to req.user if the token is valid. If the token is invalid, it logs the authentication failure using the ISecurityLoggerService and allows the request to proceed without authentication, which can be handled by route-specific authorization middleware if needed.
 */
@Middleware({ type: 'before' })
@injectable()
export class AuthMiddleware implements ExpressMiddlewareInterface {
    /**
     * @description Constructor for the AuthMiddleware class. It injects the ISecurityLoggerService for logging authentication events and the IAuthService for token verification.
     * @param securityLogger - The service responsible for logging security-related events, such as authentication attempts and failures. This service is used to log important information about authentication events, which can be useful for auditing and monitoring purposes.
     * @param authService - The service responsible for handling authentication logic, including verifying JWT tokens. This service is used to validate the authenticity of the token provided in the Authorization header of incoming requests.
     */
    constructor(
        @inject(DIContainerTokensEnum.ISecurityLoggerService)
        private readonly securityLogger: ISecurityLoggerService,
        @inject(DIContainerTokensEnum.IAuthService)
        private readonly authService: IAuthService,
    ) {}

    /**
     * @description Middleware function to protect routes with JWT authentication.
     */
    public use(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            next();
            return;
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = this.authService.verifyToken(token);
            req.user = payload;
        } catch (err) {
            this.logInvalidToken(req);
        }
        next();
    }

    private logInvalidToken(req: Request) {
        const logDTO = {
            ServiceName: ServiceNameEnum.AuthService,
            LogLevel: LogLevelEnum.WARNING,
            ActionType: ActionTypeEnum.AuthFailure,
            Message: `Invalid token for request to ${req.path}`,
        };

        this.securityLogger.createSecurityLog(logDTO);
    }
}
