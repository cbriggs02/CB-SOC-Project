import { CreateUserDTO } from '../../models/DTOs/CreateUserDTO';
import { User } from '../../models/User';
import { IGetUserResponse } from './IGetUserResponse';

/**
 * @description Interface for user-related services
 */
export interface IUserService {
    /**
     * @description Creates a new user
     * @param data
     */
    createUser(data: Partial<CreateUserDTO>): Promise<User>;

    /**
     * @description Retrieves all users
     */
    getUsers(): Promise<IGetUserResponse[]>;

    /**
     * @description Retrieves a user by ID
     * @param id
     */
    getUser(id: string): Promise<IGetUserResponse | null>;

    /**
     * @description Deletes a user by ID
     * @param id
     */
    deleteUser(id: string): Promise<void>;
}
