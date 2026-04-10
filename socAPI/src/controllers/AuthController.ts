import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { inject, injectable } from 'tsyringe';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { IAuthService } from '../interfaces/Authentication/IAuthService';
import { AuthRequestDTO } from '../models/DTOs/AuthRequestDTO';
import { BadRequestError, Body, JsonController, Post, UnauthorizedError } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

/**
 * @description Controller for authentication-related operations. Handles incoming requests, interacts with the authentication service, and sends appropriate responses.
 */
@injectable()
@JsonController('/api/auth')
@OpenAPI({ tags: ['Authentication'] })
export class AuthController {
    /**
     * @description Initializes a new instance of the AuthController class.
     * @param authService
     */
    constructor(
        @inject(DIContainerTokensEnum.IAuthService)
        private readonly authService: IAuthService,
    ) {}

    /**
     * @description Authenticates a user and returns a JWT token.
     * @param body
     * @returns
     */
    @Post('/login')
    @OpenAPI({
        summary: 'Login user',
        responses: {
            200: { description: 'Returns JWT token' },
            401: { description: 'Unauthorized' },
        },
    })
    public async login(@Body() body: AuthRequestDTO): Promise<{ token: string }> {
        const dto = plainToInstance(AuthRequestDTO, body);
        const dtoErrors = await validate(dto);

        if (dtoErrors.length > 0) {
            const messages = dtoErrors.flatMap((err) => Object.values(err.constraints || {}));
            throw new BadRequestError(messages.join(', '));
        }

        const token = await this.authService.authenticate(dto);
        if (!token) {
            throw new UnauthorizedError();
        }

        return { token };
    }
}
