import { User } from '../../models/User';
import { IUserService } from '../../interfaces/UserManagement/IUserService';
import { IGetUserResponse } from '../../interfaces/UserManagement/IGetUserResponse';
import { ERROR_MESSAGES } from '../../constants/errors';
import { ActionTypeEnum } from '../../enums/ActionTypeEnum';
import { LogLevelEnum } from '../../enums/LogLevelEnum';
import { ServiceNameEnum } from '../../enums/ServiceNameEnum';
import { CreateSecurityLogDTO } from '../../models/DTOs/CreateSecurityLogDTO';
import { AppError } from '../../errors/AppError';
import { CreateUserDTO } from '../../models/DTOs/CreateUserDTO';
import { inject, injectable } from 'tsyringe';
import { DIContainerTokensEnum } from '../../enums/DIContainerTokensEnum';
import { Repository } from 'typeorm';
import { ISecurityLoggerService } from '../../interfaces/SecurityLogger/ISecurityLoggerService';
import { IPasswordService } from '../../interfaces/UserManagement/IPasswordService';

/**
 * @description Creates a new user with the provided data. If a password is included, it will be hashed before saving.
 */
@injectable()
export class UserService implements IUserService {
    /**
     * @description Initializes the UserService with the necessary repositories and services for user management and security logging.
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
     * @description Creates a new user with the provided data. If a password is included, it will be hashed before saving.
     * @param data
     * @returns
     */
    public async createUser(data: Partial<CreateUserDTO>): Promise<User> {
        if (data.password) {
            const hashedPassword = await this.passwordService.hashPassword(data.password);
            if (!hashedPassword) {
                this.logAction(ServiceNameEnum.UserService, LogLevelEnum.ERROR, ActionTypeEnum.CreateUserFailure, `Failed to hash password for user with email: ${data.email}`);
                throw new AppError(ERROR_MESSAGES.GENERAL.INTERNAL_ERROR, 500);
            }
            data.password = hashedPassword;
        }
        const user = this.userRepo.create(data);
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.INFO, ActionTypeEnum.CreateUserSuccess, `User created with email: ${data.email}`);
        return this.userRepo.save(user);
    }

    /**
     * @description Gets all users
     * @returns
     */
    public async getUsers(): Promise<IGetUserResponse[]> {
        const users = await this.userRepo.find();
        const dtos = users.map(UserService.fromEntity);
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.INFO, ActionTypeEnum.DataAccess, `Retrieved all users`);
        return dtos;
    }

    /**
     * @description Retrieves a user by ID
     * @param id
     * @returns
     */
    public async getUser(id: string): Promise<IGetUserResponse | null> {
        const user = await this.userRepo.findOneBy({ id: id });
        if (!user) {
            return null;
        }
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.INFO, ActionTypeEnum.DataAccess, `Retrieved user with ID: ${id}`);
        return UserService.fromEntity(user);
    }

    /**
     * @description Deletes a user by ID
     * @param id
     * @returns
     */
    public async deleteUser(id: string): Promise<void> {
        const user = await this.userRepo.findOneBy({ id: id });
        if (!user) {
            this.logAction(ServiceNameEnum.UserService, LogLevelEnum.WARNING, ActionTypeEnum.DeleteUserFailure, `Failed to delete user with ID: ${id} - User not found`);
            throw new AppError(ERROR_MESSAGES.USER.NOT_FOUND, 404);
        }

        await this.userRepo.remove(user);
        this.logAction(ServiceNameEnum.UserService, LogLevelEnum.INFO, ActionTypeEnum.DeleteUserSuccess, `User deleted with email: ${user.email}`);
    }

    private static fromEntity(entity: User): IGetUserResponse {
        const { id, firstName, lastName, email } = entity;
        const dto: IGetUserResponse = {
            id: id,
            fullName: `${firstName} ${lastName}`,
            email: email,
        };
        return dto;
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
