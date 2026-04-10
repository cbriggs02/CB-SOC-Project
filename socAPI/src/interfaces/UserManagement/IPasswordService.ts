import { ChangePasswordDTO } from '../../models/DTOs/ChangePasswordDTO';

/**
 * @description Interface for password management services
 */
export interface IPasswordService {
    /**
     * @description Hashes a password
     * @param password The plain text password to hash
     * @returns A promise that resolves to the hashed password
     */
    hashPassword(password: string): Promise<string>;

    /**
     * @description Validates a password against the application's password policy
     * @param password The plain text password to validate
     * @returns A promise that resolves to a boolean indicating whether the password is valid
     */
    validatePassword(password: string): Promise<{ valid: boolean; errors: string[] }>;

    /**
     * @description Changes a user's password
     * @param userId The ID of the user whose password to change
     * @param dto The data transfer object containing the new password
     * @returns A promise that resolves when the password is changed
     */
    changePassword(userId: string, dto: ChangePasswordDTO): Promise<void>;

    /**
     * @description Compares a plain text password to a hashed password
     * @param password The plain text password to compare
     * @param hash The hashed password to compare against
     * @returns A promise that resolves to a boolean indicating whether the passwords match
     */
    comparePassword(password: string, hash: string): Promise<boolean>;
}
