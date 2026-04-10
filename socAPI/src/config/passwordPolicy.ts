import PasswordValidator from 'password-validator';

/**
 * @description Defines the password policy for the application using the password-validator library.
 * The schema specifies that passwords must be between 8 and 50 characters long, contain
 * at least one uppercase letter, one lowercase letter, one digit, and one symbol, and must not contain spaces.
 * This ensures that users create strong passwords that enhance the security of their accounts.
 */
export const passwordSchema = new PasswordValidator();
passwordSchema.is().min(12).is().max(16).has().uppercase().has().lowercase().has().digits().has().symbols().has().not().spaces();
