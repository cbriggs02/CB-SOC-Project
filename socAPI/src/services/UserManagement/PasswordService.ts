import { IPasswordService } from '../../interfaces/UserManagement/IPasswordService';
import bcrypt from 'bcrypt';
import { User } from '../../models/User';
import { ServiceNameEnum } from '../../enums/ServiceNameEnum';
import { LogLevelEnum } from '../../enums/LogLevelEnum';
import { ActionTypeEnum } from '../../enums/ActionTypeEnum';
import { CreateSecurityLogDTO } from '../../models/DTOs/CreateSecurityLogDTO';
import { AppError } from '../../errors/AppError';
import { ChangePasswordDTO } from '../../models/DTOs/ChangePasswordDTO';
import { ERROR_MESSAGES } from '../../constants/errors';
import { inject, injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { ISecurityLoggerService } from '../../interfaces/SecurityLogger/ISecurityLoggerService';
import { DIContainerTokensEnum } from '../../enums/DIContainerTokensEnum';
import { passwordSchema } from '../../config/passwordPolicy';
import { PasswordRuleEnum } from '../../enums/PasswordRuleEnum';

/**
 * @description Type representing the result of password validation, which includes an array of error messages if the password is invalid.
 */
export type PasswordValidationResult = string[];

/**
 * @description Service for managing user passwords, including hashing and changing passwords.
 */
@injectable()
export class PasswordService implements IPasswordService {
    /**
     * @description Initializes the PasswordService with the necessary repositories and services for user management and security logging.
     * @param userRepo
     * @param securityLogger
     */
    constructor(
        @inject(DIContainerTokensEnum.UserRepository)
        private readonly userRepo: Repository<User>,
        @inject(DIContainerTokensEnum.ISecurityLoggerService)
        private readonly securityLogger: ISecurityLoggerService,
    ) {}

    /**
     * @description Changes the password for a user.
     * @param userId
     * @param newPassword
     */
    public async changePassword(userId: string, dto: ChangePasswordDTO): Promise<void> {
        const { newPassword, currentPassword } = dto;

        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            this.throwError(`User not found with ID: ${userId}`, ActionTypeEnum.ChangePasswordFailure, LogLevelEnum.WARNING);
        }

        const isValid = await this.comparePassword(currentPassword, user.password);
        if (!isValid) {
            this.throwError(`Invalid current password for user ${userId}`, ActionTypeEnum.ChangePasswordFailure, LogLevelEnum.WARNING);
        }

        const passwordsMatch = await this.comparePassword(newPassword, user.password);
        if (passwordsMatch) {
            this.throwError(`New password matches old password for user ID: ${userId}`, ActionTypeEnum.ChangePasswordFailure, LogLevelEnum.WARNING);
        }

        user.password = await this.hashPassword(newPassword);
        await this.userRepo.save(user);
        this.logAction(ServiceNameEnum.PasswordService, LogLevelEnum.INFO, ActionTypeEnum.ChangePasswordSuccess, `Password changed successfully for user ID: ${userId}`);
    }

    /**
     * @description Validates a password against the application's password policy.
     * @param password
     * @returns
     */
    public async validatePassword(password: string): Promise<{ valid: boolean; errors: string[] }> {
        const validationResult: PasswordValidationResult = passwordSchema.validate(password, { list: true }) as PasswordValidationResult;

        const errors = validationResult.map((rule) => {
            switch (rule) {
                case PasswordRuleEnum.MinLength:
                    return ERROR_MESSAGES.PASSWORD.MIN_LENGTH;
                case PasswordRuleEnum.Uppercase:
                    return ERROR_MESSAGES.PASSWORD.UPPERCASE;
                case PasswordRuleEnum.Digits:
                    return ERROR_MESSAGES.PASSWORD.DIGITS;
                case PasswordRuleEnum.Symbols:
                    return ERROR_MESSAGES.PASSWORD.SYMBOLS;
                default:
                    return ERROR_MESSAGES.PASSWORD.DEFAULT;
            }
        });
        return { valid: errors.length === 0, errors };
    }

    /**
     * @description Hashes a password using bcrypt.
     * @param password
     * @returns
     */
    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    private throwError(message: string, actionType: ActionTypeEnum, logLevel: LogLevelEnum = LogLevelEnum.ERROR, statusCode: number = 400): never {
        this.logAction(ServiceNameEnum.PasswordService, logLevel, actionType, message);
        throw new AppError(ERROR_MESSAGES.PASSWORD.PASSWORD_OPERATION_FAILURE, statusCode);
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
