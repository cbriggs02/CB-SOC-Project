import { container } from 'tsyringe';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';
import { UserService } from '../services/UserManagement/UserService';
import { PasswordService } from '../services/UserManagement/PasswordService';
import { SecurityLoggerService } from '../services/Security/SecurityLoggerService';
import { IUserService } from '../interfaces/UserManagement/IUserService';
import { IPasswordService } from '../interfaces/UserManagement/IPasswordService';
import { ISecurityLoggerService } from '../interfaces/SecurityLogger/ISecurityLoggerService';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { Repository } from 'typeorm';
import { AuthService } from '../services/Authentication/AuthService';
import { IAuthService } from '../interfaces/Authentication/IAuthService';

/**
 * @description Registers all dependencies with tsyringe
 */
export const registerDependencies = () => {
    container.register<Repository<User>>(DIContainerTokensEnum.UserRepository, {
        useValue: AppDataSource.getRepository(User),
    });
    container.registerSingleton<ISecurityLoggerService>(DIContainerTokensEnum.ISecurityLoggerService, SecurityLoggerService);
    container.registerSingleton<IUserService>(DIContainerTokensEnum.IUserService, UserService);
    container.registerSingleton<IPasswordService>(DIContainerTokensEnum.IPasswordService, PasswordService);
    container.registerSingleton<IAuthService>(DIContainerTokensEnum.IAuthService, AuthService);
};
