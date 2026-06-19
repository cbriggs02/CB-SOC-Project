import { JsonController, Post, Get, Param, Delete, Body, BadRequestError, NotFoundError, Authorized } from 'routing-controllers';
import { CreateUserDTO } from '../models/DTOs/CreateUserDTO';
import { inject, injectable } from 'tsyringe';
import { IUserService } from '../interfaces/UserManagement/IUserService';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { IPasswordService } from '../interfaces/UserManagement/IPasswordService';
import { IGetUserResponse } from '../interfaces/UserManagement/IGetUserResponse';
import { OpenAPI } from 'routing-controllers-openapi';
import { UserRoleEnum } from '../enums/UserRoleEnum';

/**
 * @description Controller for user-related operations. Handles incoming requests, interacts with the user service, and sends appropriate responses.
 */
@injectable()
@JsonController('/api/users')
@OpenAPI({ tags: ['User Management'] })
export class UsersController {
    /**
     * @description Initializes a new instance of the UserController class.
     * @param userService - The service responsible for handling user-related operations, such as creating users, retrieving user information, and deleting users. This service is injected into the controller using dependency injection, allowing for better separation of concerns and easier testing.
     * @param passwordService - The service responsible for handling password-related operations, such as validating passwords when creating a new user. This service is injected into the controller using dependency injection, allowing for better separation of concerns and easier testing. It is used in the createUser method to validate the password before creating a new user.
     */
    constructor(
        @inject(DIContainerTokensEnum.IUserService) private userService: IUserService,
        @inject(DIContainerTokensEnum.IPasswordService) private passwordService: IPasswordService,
    ) {}

    /**
     * @description Creates a new user with the provided data.
     * @param dto - The data transfer object containing the information needed to create a new user, such as first name, last name, email, and password. This DTO is validated to ensure that the provided data meets the required criteria before being processed by the user service. If the password does not meet validation criteria, a BadRequestError is thrown with the relevant error messages. If the user is created successfully, a response is returned indicating that the user was created along with the new user's ID. The method also includes OpenAPI documentation for the endpoint, specifying the expected request body and possible responses.
     * @returns A response indicating the success or failure of the user creation operation. If the user is created successfully, it returns a 201 Created response with a message and the new user's ID. If the provided data is invalid (e.g., if the password does not meet validation criteria), a BadRequestError is thrown with the relevant error messages. The method also includes OpenAPI documentation for the endpoint, specifying the expected request body and possible responses.
     */
    @Post()
    @OpenAPI({
        summary: 'Creates a new user',
        responses: {
            201: { description: 'User created successfully' },
            400: { description: 'Invalid user data' },
        },
    })
    public async createUser(@Body() dto: CreateUserDTO) {
        const { valid, errors } = await this.passwordService.validatePassword(dto.password);
        if (!valid) {
            throw new BadRequestError(errors.join(', '));
        }

        const user = await this.userService.createUser(dto);
        return { message: 'User created successfully', id: user.id };
    }

    /**
     * @description Gets all users.
     * @returns A list of all users.
     */
    @Get()
    @Authorized([UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN])
    @OpenAPI({
        summary: 'Gets all users',
        responses: {
            200: { description: 'Returns a list of users' },
        },
    })
    public async getUsers(): Promise<IGetUserResponse[]> {
        return await this.userService.getUsers();
    }

    /**
     * @description Gets a user by ID.
     * @param id - The unique identifier of the user to be retrieved. This parameter is extracted from the URL path and is used to identify the user in the database. If a user with the specified ID is found, their information is returned. If no user with the given ID exists, a NotFoundError is thrown, resulting in a 404 Not Found response. The method also includes OpenAPI documentation for the endpoint, specifying the expected path parameter and possible responses.
     * @returns The user information if a user with the specified ID is found. If no user with the given ID exists, a NotFoundError is thrown, resulting in a 404 Not Found response. The method also includes OpenAPI documentation for the endpoint, specifying the expected path parameter and possible responses.
     */
    @Get('/:id')
    @Authorized([UserRoleEnum.USER, UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN])
    @OpenAPI({
        summary: 'Gets a user by ID',
        responses: {
            200: { description: 'Returns the requested user' },
            404: { description: 'User not found' },
        },
    })
    public async getUser(@Param('id') id: string): Promise<IGetUserResponse> {
        const user = await this.userService.getUser(id);
        if (!user) {
            throw new NotFoundError();
        }
        return user;
    }

    /**
     * @description Deletes a user by ID.
     * @param id - The unique identifier of the user to be deleted. This parameter is extracted from the URL path and is used to identify the user in the database. If a user with the specified ID is found, they are deleted. If no user with the given ID exists, a NotFoundError is thrown, resulting in a 404 Not Found response. The method also includes OpenAPI documentation for the endpoint, specifying the expected path parameter and possible responses.
     */
    @Delete('/:id')
    @Authorized([UserRoleEnum.USER, UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN])
    @OpenAPI({
        summary: 'Deletes a user',
        responses: {
            204: { description: 'User deleted successfully' },
            404: { description: 'User not found' },
        },
    })
    public async deleteUser(@Param('id') id: string) {
        await this.userService.deleteUser(id);
        return null;
    }
}
