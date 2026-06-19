import { inject, injectable } from 'tsyringe';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { IAuthService } from '../interfaces/Authentication/IAuthService';
import { AuthRequestDTO } from '../models/DTOs/AuthRequestDTO';
import { Body, JsonController, Post, UnauthorizedError } from 'routing-controllers';
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
     * @param authService - The authentication service that will be used to handle authentication logic, such as verifying user credentials and generating JWT tokens. This service is injected into the controller using dependency injection, allowing for better separation of concerns and easier testing.
     */
    constructor(@inject(DIContainerTokensEnum.IAuthService) private readonly authService: IAuthService) {}

    /**
     * @description Authenticates a user and returns a JWT token.
     * @param dto - The authentication request data transfer object containing the user's email and password. This DTO is validated to ensure that the email is in a valid format and that the password is not empty before being processed by the authentication service.
     * @returns An object containing the JWT token if authentication is successful. If authentication fails (e.g., due to invalid credentials), an UnauthorizedError is thrown, resulting in a 401 Unauthorized response. The method also includes OpenAPI documentation for the endpoint, specifying the expected request body and possible responses.
     */
    @Post('/login')
    @OpenAPI({
        summary: 'Login user',
        responses: {
            200: { description: 'Returns JWT token' },
            401: { description: 'Unauthorized' },
        },
    })
    public async login(@Body() dto: AuthRequestDTO): Promise<{ token: string }> {
        const token = await this.authService.authenticate(dto);
        if (!token) {
            throw new UnauthorizedError();
        }
        return { token };
    }
}
