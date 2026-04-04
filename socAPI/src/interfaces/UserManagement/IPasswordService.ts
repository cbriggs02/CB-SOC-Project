import { ChangePasswordDTO } from "../../models/DTOs/ChangePasswordDTO";

/**
 * Interface for password management services
 */
export interface IPasswordService {

    /** Hashes a password
     * @param password The plain text password to hash
     * @returns A promise that resolves to the hashed password
     */
    hashPassword (password: string): Promise<string>;

    /**
     * 
     * @param userId 
     * @param dto 
     */
    changePassword (userId: string, dto: ChangePasswordDTO): Promise<void>;
}