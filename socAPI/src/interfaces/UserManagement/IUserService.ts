import { CreateUserDTO } from '../../models/DTOs/CreateUserDTO';
import { User } from '../../models/User';
import { IGetUserResponse } from './IGetUserResponse';

/**
 * @description Interface for user-related services
 */
export interface IUserService {
    /**
     * @description Creates a new user
     * @param data - The data for creating the new user.
     * @returns A promise resolving to the created user.
     */
    createUser(data: Partial<CreateUserDTO>): Promise<User>;

    /**
     * @description Retrieves all users
     * @return A promise resolving to an array of user responses containing user details.
     */
    getUsers(): Promise<IGetUserResponse[]>;

    /**
     * @description Retrieves a user by ID
     * @param id - The unique identifier of the user to be retrieved.
     * @return A promise resolving to the user information if a user with the specified ID is found, or null if no user with the given ID exists.
     */
    getUser(id: string): Promise<IGetUserResponse | null>;

    /**
     * @description Deletes a user by ID
     * @param id - The unique identifier of the user to be deleted.
     * @return A promise that resolves when the user is deleted. The method does not return any value upon successful completion.
     */
    deleteUser(id: string): Promise<void>;
}
