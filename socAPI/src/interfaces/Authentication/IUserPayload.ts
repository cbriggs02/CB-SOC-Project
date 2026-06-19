import { UserRoleEnum } from '../../enums/UserRoleEnum';
import { JwtPayload } from 'jsonwebtoken';

/**
 * @description Defines the structure of the JWT payload used for authentication.
 */
export interface UserPayload extends JwtPayload {
    userId: string;
    email: string;
    role: UserRoleEnum;
}
