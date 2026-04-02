import { IsEmail, IsNotEmpty, Length } from "class-validator";

/**
 * Data Transfer Object for creating a new user. Defines the structure and validation rules for incoming user creation requests.
 * This DTO ensures that the required fields are present and meet the specified criteria before processing the request.
 */
export class CreateUserDTO {
    /**
     * The user's first name, which is required and must be between 2 and 50 characters in length
     */
    @IsNotEmpty({ message: "First name is required" })
    @Length(2, 50, { message: "First name must be between 2 and 50 characters" })
    firstName!: string;

    /**
     * The user's last name, which is required and must be between 2 and 50 characters in length
     */
    @IsNotEmpty({ message: "Last name is required" })
    @Length(2, 50, { message: "Last name must be between 2 and 50 characters" })
    lastName!: string;

    /**
     * The user's email address, which is required and must be a valid email format
     */
    @IsEmail({}, { message: "Email must be a valid email address" })
    @IsNotEmpty({ message: "Email is required" })
    email!: string;

    /**
     * The user's password, which is required and must be between 6 and 255 characters in length
     */
    @IsNotEmpty({ message: "Password is required" })
    @Length(12, 16, { message: "Password must be between 12 and 16 characters" })
    password!: string;
}