import { AppDataSource } from "../../config/data-source";
import { IPasswordService } from "../../interfaces/UserManagement/IPasswordService";
import bcrypt from "bcrypt";
import { User } from "../../models/User";
import { SecurityLoggerService } from "../Security/SecurityLoggerService";
import { ServiceNameEnum } from "../../enums/ServiceNameEnum";
import { LogLevelEnum } from "../../enums/LogLevelEnum";
import { ActionTypeEnum } from "../../enums/ActionTypeEnum";
import { CreateSecurityLogDTO } from "../../models/DTOs/CreateSecurityLogDTO";
import { AppError } from "../../errors/AppError";
import { ChangePasswordDTO } from "../../models/DTOs/ChangePasswordDTO";
import { ERRORS } from "../../constants/errors";

/**
 * Service for managing user passwords, including hashing and changing passwords.
 */
export class PasswordService implements IPasswordService {
    private userRepo = AppDataSource.getRepository(User);
    private securityLogger = new SecurityLoggerService();

    /**
     * Changes the password for a user.
     * @param userId 
     * @param newPassword 
     */
    public async changePassword (userId: string, dto: ChangePasswordDTO): Promise<void> {
        const { newPassword, currentPassword } = dto;

        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            this.throwError(`User not found with ID: ${userId}`, ActionTypeEnum.ChangePasswordFailure, LogLevelEnum.WARNING);
        }

        const isValid = await this.validatePassword(currentPassword, user.password);
        if (!isValid) {
            this.throwError(`Invalid current password for user ${userId}`, ActionTypeEnum.ChangePasswordFailure, LogLevelEnum.WARNING);
        }

        const passwordsMatch = await this.validatePassword(newPassword, user.password);
        if (passwordsMatch) {
            this.throwError(`New password matches old password for user ID: ${userId}`, ActionTypeEnum.ChangePasswordFailure, LogLevelEnum.WARNING);
        }

        user.password = await this.hashPassword(newPassword);
        await this.userRepo.save(user);
        this.logAction(ServiceNameEnum.PasswordService, LogLevelEnum.INFO, ActionTypeEnum.ChangePasswordSuccess, `Password changed successfully for user ID: ${userId}`);
    }

    /**
     * Hashes a password using bcrypt.
     * @param password 
     * @returns 
     */
    public async hashPassword (password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    private async validatePassword (password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    private throwError (message: string, actionType: ActionTypeEnum, logLevel: LogLevelEnum = LogLevelEnum.ERROR, statusCode: number = 400): never {
        this.logAction(ServiceNameEnum.PasswordService, logLevel, actionType, message);
        throw new AppError(ERRORS.PASSWORD_OPERATION_FAILURE, statusCode);
    }

    private logAction (serviceName: ServiceNameEnum, logLevel: LogLevelEnum, actionType: ActionTypeEnum, message: string) {
        const logDTO: CreateSecurityLogDTO = {
            ServiceName: serviceName,
            LogLevel: logLevel,
            ActionType: actionType,
            Message: message
        };
        this.securityLogger.createSecurityLog(logDTO);
    }
}