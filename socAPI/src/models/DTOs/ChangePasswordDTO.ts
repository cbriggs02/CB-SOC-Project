import { IsNotEmpty, Length } from "class-validator";

/**
 * Data Transfer Object for changing a user's password. Defines the structure and validation rules for incoming password change requests.
 * This DTO ensures that the required fields are present and meet the specified criteria before processing the request.
 */
export class ChangePasswordDTO {

    /**
     * The old password for the user, which is required and must be between 12 and 16 characters in length
     */
    @IsNotEmpty({ message: "Current password is required" })
    @Length(12, 16, { message: "Current password must be between 12 and 16 characters" })
    currentPassword!: string;

    /**
     * The new password for the user, which is required and must be between 12 and 16 characters in length
     */
    @IsNotEmpty({ message: "New password is required" })
    @Length(12, 16, { message: "New password must be between 12 and 16 characters" })
    newPassword!: string;
}