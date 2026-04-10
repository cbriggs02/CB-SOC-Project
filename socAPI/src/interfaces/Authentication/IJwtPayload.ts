/**
 * @description Defines the structure of the JWT payload used for authentication.
 */
export interface JwtPayload {
    userId: string;
    email: string;
}
