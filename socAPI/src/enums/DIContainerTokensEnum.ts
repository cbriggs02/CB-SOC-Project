/**
 * @description This file defines the tokens used for dependency injection in the application.
 * These tokens are used to register and resolve dependencies in the DI container.
 */
export enum DIContainerTokensEnum {
    UserRepository = 'UserRepository',
    ISecurityLoggerService = 'ISecurityLoggerService',
    IUserService = 'IUserService',
    IPasswordService = 'IPasswordService',
    IAuthService = 'IAuthService',
}
