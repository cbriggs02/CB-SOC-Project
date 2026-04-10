import { AuthRequestDTO } from '../../models/DTOs/AuthRequestDTO';
import { JwtPayload } from '../../interfaces/Authentication/IJwtPayload';

/**
 * @description Interface for the authentication service. This service is responsible for authenticating users based on their email and password.
 * The authenticate method takes an email and password as input and returns a promise that resolves to a JWT token if the authentication is successful,
 * or null if it fails. This interface can be implemented by any class that provides authentication functionality, allowing for flexibility in how authentication
 * is handled within the application.
 */
export interface IAuthService {
    /**
     * @description Authenticates a user based on the provided authentication request.
     * @param authRequest The DTO containing the user's authentication credentials.
     * @returns A promise that resolves to a string containing the JWT token if authentication is successful, or null if authentication fails.
     */
    authenticate(authRequest: AuthRequestDTO): Promise<string | null>;

    /**
     * @description Verifies the authenticity of a JWT token and returns its payload.
     * @param token The JWT token to verify.
     * @returns The payload contained in the token.
     */
    verifyToken(token: string): JwtPayload;
}
