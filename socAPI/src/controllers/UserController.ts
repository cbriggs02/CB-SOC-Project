import { JsonController, Post, Get, Param, Delete, Body, BadRequestError, NotFoundError } from 'routing-controllers';
import { CreateUserDTO } from '../models/DTOs/CreateUserDTO';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { IUserService } from '../interfaces/UserManagement/IUserService';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { IPasswordService } from '../interfaces/UserManagement/IPasswordService';
import { IGetUserResponse } from '../interfaces/UserManagement/IGetUserResponse';
import { OpenAPI } from 'routing-controllers-openapi';

/**
 * @description Controller for user-related operations. Handles incoming requests, interacts with the user service, and sends appropriate responses.
 */
@injectable()
@JsonController('/api/users')
@OpenAPI({ tags: ['User Management'] })
export class UserController {
    /**
     * @description Initializes a new instance of the UserController class.
     * @param userService
     * @param passwordService
     */
    constructor(
        @inject(DIContainerTokensEnum.IUserService)
        private userService: IUserService,
        @inject(DIContainerTokensEnum.IPasswordService)
        private passwordService: IPasswordService,
    ) {}

    /**
     * @description Creates a new user with the provided data.
     * @returns
     */
    @Post()
    @OpenAPI({
        summary: 'Creates a new user',
        responses: {
            201: { description: 'User created successfully' },
            400: { description: 'Invalid user data' },
        },
    })
    public async createUser(@Body() body: CreateUserDTO) {
        const dto = plainToInstance(CreateUserDTO, body);
        const dtoErrors = await validate(dto);

        if (dtoErrors.length > 0) {
            const messages = dtoErrors.flatMap((err) => Object.values(err.constraints || {}));
            throw new BadRequestError(messages.join(', '));
        }

        const { valid, errors } = await this.passwordService.validatePassword(dto.password);
        if (!valid) {
            throw new BadRequestError(errors.join(', '));
        }

        const user = await this.userService.createUser(dto);
        return { message: 'User created successfully', id: user.id };
    }

    /**
     * @description Gets all users.
     * @returns
     */
    @Get()
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
     * @param id
     * @returns
     */
    @Get('/:id')
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
     * @param id
     */
    @Delete('/:id')
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
