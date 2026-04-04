import { AppDataSource } from "../../data-source";
import { User } from "../../models/User";
import { IUserService } from "../../interfaces/UserManagement/IUserService";
import { IGetUserResponse } from "../../interfaces/UserManagement/IGetUserResponse";
import { ERRORS } from "../../constants/errors";
import { SecurityLoggerService } from "../Security/SecurityLoggerService";
import { ActionTypeEnum } from "../../enums/ActionTypeEnum";
import { LogLevelEnum } from "../../enums/LogLevelEnum";
import { ServiceNameEnum } from "../../enums/ServiceNameEnum";
import { CreateSecurityLogDTO } from "../../models/DTOs/CreateSecurityLogDTO";
import { AppError } from "../../errors/AppError";
import { PasswordService } from "./PasswordService";
import { CreateUserDTO } from "../../models/DTOs/CreateUserDTO";

/**
 * Creates a new user with the provided data. If a password is included, it will be hashed before saving.
 */
export class UserService implements IUserService {
    private userRepo = AppDataSource.getRepository(User);
    private passwordService = new PasswordService();
    private securityLogger = new SecurityLoggerService();

    /**
     * Creates a new user with the provided data. If a password is included, it will be hashed before saving.
     * @param data 
     * @returns 
     */
    public async createUser (data: Partial<CreateUserDTO>): Promise<User> {
        if (data.password) {
            const hashedPassword = await this.passwordService.hashPassword(data.password);
            if (!hashedPassword) {
                this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Error, ActionTypeEnum.CreateUserFailure, `Failed to hash password for user with email: ${data.email}`);
                throw new AppError(ERRORS.INTERNAL_ERROR, 500);
            }
            data.password = hashedPassword;
        }
        const user = this.userRepo.create(data);
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Info, ActionTypeEnum.CreateUserSuccess, `User created with email: ${data.email}`);
        return this.userRepo.save(user);
    }

    /**
     * Gets all users
     * @returns 
     */
    public async getUsers (): Promise<IGetUserResponse[]> {
        const users = await this.userRepo.find();
        const dtos = users.map(UserService.fromEntity);
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Info, ActionTypeEnum.DataAccess, `Retrieved all users`);
        return dtos;
    }

    /**
     * Retrieves a user by ID
     * @param id 
     * @returns 
     */
    public async getUser (id: string): Promise<IGetUserResponse> {
        const user = await this.userRepo.findOneBy({ id: id });
        if (!user) {
            this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Warning, ActionTypeEnum.DataAccess, `Failed to retrieve user with ID: ${id} - User not found`);
            throw new AppError(ERRORS.USER_NOT_FOUND, 404);
        }
        return UserService.fromEntity(user);
    }

    /**
     * Deletes a user by ID
     * @param id 
     * @returns 
     */
    public async deleteUser (id: string): Promise<void> {
        const user = await this.userRepo.findOneBy({ id: id });
        if (!user) {
            this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Warning, ActionTypeEnum.DeleteUserFailure, `Failed to delete user with ID: ${id} - User not found`);
            throw new AppError(ERRORS.USER_NOT_FOUND, 404);
        }

        await this.userRepo.remove(user);
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.Info, ActionTypeEnum.DeleteUserSuccess, `User deleted with email: ${user.email}`);
    }

    private static fromEntity (entity: User): IGetUserResponse {
        const { id, firstName, lastName, email } = entity;
        const dto: IGetUserResponse = {
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