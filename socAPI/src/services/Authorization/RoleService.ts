import { Repository } from 'typeorm';
import { ActionTypeEnum } from '../../enums/ActionTypeEnum';
import { DIContainerTokensEnum } from '../../enums/DIContainerTokensEnum';
import { LogLevelEnum } from '../../enums/LogLevelEnum';
import { ServiceNameEnum } from '../../enums/ServiceNameEnum';
import { UserRoleEnum } from '../../enums/UserRoleEnum';
import { AppError } from '../../errors/AppError';
import { IRoleService } from '../../interfaces/Authorization/IRoleService';
import { CreateSecurityLogDTO } from '../../models/DTOs/CreateSecurityLogDTO';
import { ISecurityLoggerService } from '../../interfaces/SecurityLogger/ISecurityLoggerService';
import { User } from '../../models/User';
import { inject, injectable } from 'tsyringe';
import { ERROR_MESSAGES } from '../../constants/errors';

/**
 * @description RoleService is responsible for managing user roles within the application. It provides functionality to assign roles to users, which is crucial for implementing role-based access control (RBAC). The service interacts with the UserRepository to retrieve and update user data, and with the SecurityLoggerService to log role assignment actions for auditing purposes. The AssignRole method checks if the user exists, updates their role, and logs the outcome of the operation. If the user does not exist, it logs a warning and throws an error indicating that the role assignment failed.
 */
@injectable()
export class RoleService implements IRoleService {
    /**
     * @description Initializes a new instance of the RoleService class.
     * @param userRepo - The repository for accessing user data in the database.
     * @param securityLogger - The service responsible for logging security-related events, such as role assignments.
     */
    constructor(
        @inject(DIContainerTokensEnum.UserRepository) private readonly userRepo: Repository<User>,
        @inject(DIContainerTokensEnum.ISecurityLoggerService) private readonly securityLogger: ISecurityLoggerService,
    ) {}

    /**
     * @description Assigns a role to a user. This method first checks if the user with the given ID exists in the database. If the user does not exist, it logs a warning and throws an AppError indicating that the role assignment failed. If the user exists and already has the specified role, the method simply returns without making any changes. If the user exists and has a different role, it updates the user's role in the database and logs an informational message indicating that the role was changed successfully.
     * @param id - The unique identifier of the user to whom the role will be assigned.
     * @param roleName - The name of the role to be assigned to the user, represented as a value from the UserRoleEnum.
     * @returns A promise that resolves when the role assignment is complete. The method does not return any value upon successful completion.
     */
    public async AssignRole(id: string, roleName: UserRoleEnum): Promise<void> {
        const user = await this.userRepo.findOneBy({ id: id });
        if (!user) {
            this.logAction(ServiceNameEnum.RoleService, LogLevelEnum.WARNING, ActionTypeEnum.AssignRoleFailure, `User not found with ID: ${id}`);
            throw new AppError(ERROR_MESSAGES.AUTHORIZATION.ROLE_OPERATION_FAILED, 404);
        }

        if (user.role == roleName) {
            return;
        }

        user.role = roleName;
        await this.userRepo.save(user);
        this.logAction(ServiceNameEnum.RoleService, LogLevelEnum.INFO, ActionTypeEnum.AssignRoleSuccess, `Role changed successfully for user ID: ${id}`);
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
