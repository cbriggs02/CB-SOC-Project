import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * @description Data Transfer Object for user authentication requests. Defines the structure and validation rules for incoming authentication requests, ensuring that the required fields are present and meet the specified criteria before processing the request.
 * This DTO is used to encapsulate the email and password provided by the user during the login process, allowing for a clean and organized way to handle authentication data within the application.
 */
export class AuthRequestDTO {
    @IsEmail({}, { message: 'Invalid email format' })
    email!: string;

    @IsNotEmpty({ message: 'password is required' })
    password!: string;
}
