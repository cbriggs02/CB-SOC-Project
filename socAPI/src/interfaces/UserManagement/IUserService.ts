import { CreateUserDTO } from "../../models/DTOs/CreateUserDTO";
import { User } from "../../models/User";
import { IGetUserResponse } from "./IGetUserResponse";

/**
 * Interface for user-related services
 */
export interface IUserService {

    /**
     * Creates a new user
     * @param data 
     */
    createUser (data: Partial<CreateUserDTO>): Promise<User>;

    /**
     * Retrieves all users
     */
    getUsers (): Promise<IGetUserResponse[]>;

    /**
     * Retrieves a user by ID
     * @param id 
     */
    getUser (id: string): Promise<IGetUserResponse>;

    /**
     * Deletes a user by ID
     * @param id 
     */
    deleteUser (id: string): Promise<void>;
}