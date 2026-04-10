import { AuthController } from './AuthController';
import { PasswordController } from './PasswordController';
import { UserController } from './UserController';

/**
 * @description Array of all controllers in the application. This is used for automatic route registration and Swagger documentation generation.
 * Each controller should be added to this array to ensure it is included in the application's routing and API documentation.
 */
export const controllers = [UserController, PasswordController, AuthController];
