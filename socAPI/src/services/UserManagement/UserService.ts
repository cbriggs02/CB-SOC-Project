import { AppDataSource } from "../../data-source";
import { User } from "../../models/User";
import bcrypt from "bcrypt";
import { IUserService } from "../../interfaces/UserManagement/IUserService";
import { IGetUsersResponse } from "../../interfaces/UserManagement/IGetUsersResponse";
import { ERRORS } from "../../constants/errors";
import { ParameterValidatorService } from "../Utility/ParameterValidatorService";
import { SecurityLoggerService } from "../Security/SecurityLoggerService";
import { ActionTypeEnum } from "../../enums/ActionTypeEnum";
import { LogLevelEnum } from "../../enums/LogLevelEnum";
import { ServiceNameEnum } from "../../enums/ServiceNameEnum";
import { CreateSecurityLogDTO } from "../../models/DTOs/CreateSecurityLogDTO";
import { AppError } from "../../errors/AppError";

/**
 * Creates a new user with the provided data. If a password is included, it will be hashed before saving.
 */
export class UserService implements IUserService {
    private userRepo = AppDataSource.getRepository(User);
    private parameterValidator = new ParameterValidatorService();
    private securityLogger = new SecurityLoggerService();

    /**
     * Creates a new user with the provided data. If a password is included, it will be hashed before saving.
     * @param data 
     * @returns 
     */
    public async createUser (data: Partial<User>) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const user = this.userRepo.create(data);
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Info, ActionTypeEnum.CreateUserSuccess, `User created with email: ${data.email}`);
        return this.userRepo.save(user);
    }

    /**
     * Gets all users
     * @returns 
     */
    public async getAllUsers (): Promise<IGetUsersResponse[]> {
        const users = await this.userRepo.find();
        const dtos = users.map(UserService.fromEntity);
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Info, ActionTypeEnum.DataAccess, `Retrieved all users`);
        return dtos;
    }

    /**
     * Deletes a user by ID
     * @param id 
     * @returns 
     */
    public async deleteUser (id: string) {
        this.parameterValidator.validate({ id });
        const user = await this.userRepo.findOneBy({ id: id });
        if (!user) {
            this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Warning, ActionTypeEnum.DeleteUserFailure, `Failed to delete user with ID: ${id} - User not found`);
            throw new AppError(ERRORS.USER_NOT_FOUND, 404);
        }
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Info, ActionTypeEnum.DeleteUserSuccess, `User deleted with email: ${user.email}`);
        return this.userRepo.remove(user);
    }

    private static fromEntity (entity: User): IGetUsersResponse {
        const { id, firstName, lastName, email } = entity;
        const dto: IGetUsersResponse = {
            id: id,
            fullName: `${firstName} ${lastName}`,
            email: email
        };
        return dto;
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