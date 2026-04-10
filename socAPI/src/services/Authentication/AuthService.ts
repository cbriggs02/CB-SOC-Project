import { inject, injectable } from 'tsyringe';
import { IAuthService } from '../../interfaces/Authentication/IAuthService';
import { DIContainerTokensEnum } from '../../enums/DIContainerTokensEnum';
import { Repository } from 'typeorm';
import { User } from '../../models/User';
import { ISecurityLoggerService } from '../../interfaces/SecurityLogger/ISecurityLoggerService';
import { ServiceNameEnum } from '../../enums/ServiceNameEnum';
import { LogLevelEnum } from '../../enums/LogLevelEnum';
import { ActionTypeEnum } from '../../enums/ActionTypeEnum';
import { IPasswordService } from '../../interfaces/UserManagement/IPasswordService';
import { CreateSecurityLogDTO } from '../../models/DTOs/CreateSecurityLogDTO';
import { env } from '../../config/env';
import { AuthRequestDTO } from '../../models/DTOs/AuthRequestDTO';
import jwt from 'jsonwebtoken';
import { AppError } from '../../errors/AppError';
import { JwtPayload } from '../../interfaces/Authentication/IJwtPayload';

/**
 * @description AuthService is responsible for handling user authentication, including verifying credentials and generating JWT tokens.
 * It interacts with the UserRepository to retrieve user data, the PasswordService to validate passwords, and the SecurityLoggerService to log authentication events.
 * The authenticate method checks if the provided email and password are valid, logs the outcome, and returns a JWT token if authentication is successful. The verifyToken method validates
 *  a given JWT token and returns its payload if valid.
 */
@injectable()
export class AuthService implements IAuthService {
    private readonly secret = env.JWT_SECRET;
    private readonly expiresIn = '1h';

    /**
     * @description Initializes a new instance of the AuthService class.
     * @param userRepo
     * @param securityLogger
     * @param passwordService
     */
    constructor(
        @inject(DIContainerTokensEnum.UserRepository)
        private readonly userRepo: Repository<User>,
        @inject(DIContainerTokensEnum.ISecurityLoggerService)
        private readonly securityLogger: ISecurityLoggerService,
        @inject(DIContainerTokensEnum.IPasswordService)
        private readonly passwordService: IPasswordService,
    ) {}

    /**
     * @description Authenticates a user based on the provided authentication request. This method checks if the user exists and if the provided password is correct. If authentication is successful, it logs the event and returns a mock JWT token. If authentication fails, it logs the failure and returns null.
     */
    public async authenticate(authRequest: AuthRequestDTO): Promise<string | null> {
        const { email, password } = authRequest;
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            this.logAction(ServiceNameEnum.AuthService, LogLevelEnum.WARNING, ActionTypeEnum.AuthFailure, `User not found with email: ${email}`);
            return null;
        }

        const isValid = await this.passwordService.comparePassword(password, user.password);
        if (!isValid) {
            this.logAction(ServiceNameEnum.AuthService, LogLevelEnum.WARNING, ActionTypeEnum.AuthFailure, `Invalid password for user with email: ${email}`);
            return null;
        }

        this.logAction(ServiceNameEnum.AuthService, LogLevelEnum.INFO, ActionTypeEnum.AuthSuccess, `User authenticated with email: ${email}`);
        const payload: JwtPayload = { userId: user.id, email: user.email };
        return this.generateToken(payload);
    }

    /**
     * @description Verifies the authenticity of a JWT token and returns its payload.
     * @param token
     * @returns
     */
    public verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, this.secret) as JwtPayload;
        } catch (err) {
            throw new AppError('Invalid or expired token', 401);
        }
    }

    private generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    private logAction(serviceName: ServiceNameEnum, logLevel: LogLevelEnum, actionType: ActionTypeEnum, message: string) {
        const logDTO: CreateSecurityLogDTO = {
            ServiceName: serviceName,
            LogLevel: logLevel,
            ActionType: actionType,
            Message: message,
        };
        this.securityLogger.createSecurityLog(logDTO);
    }
}
