import { User } from "../../models/User";
import { IGetUsersResponse } from "./IGetUsersResponse";

/**
 * Interface for user-related services
 */
export interface IUserService {

    /**
     * Creates a new user
     * @param data 
     */
    createUser (data: Partial<User>): Promise<User>;

    /**
     * Retrieves all users
     */
    getAllUsers (): Promise<IGetUsersResponse[]>;

    /**
     * Deletes a user by ID
     * @param id 
     */
    deleteUser (id: string): Promise<User>;
}