import { JwtPayload } from "../../src/interfaces/Authentication/IUserPayload";
export {};

/**
 * @description This module extends the Express Request interface to include a strongly-typed `user` property,
 * which represents the authenticated user's information extracted from a JWT token. This allows for better type safety
 * and easier access to user data in route handlers and middleware throughout the application.
 */
declare module "express-serve-static-core" {
  /**
   * @description Extends the Express Request interface to include a `user` property of type `MyJwtPayload`. This property is optional and is intended to hold
   * the decoded JWT payload after successful authentication. By adding this property, developers can easily access user information in their
   * route handlers and middleware without needing to perform additional type assertions or checks.
   */
  interface Request {
    /**
     * @description The `user` property is an optional field that holds the decoded JWT payload, which contains information about the authenticated user.
     * This allows route handlers and middleware to access user details such as user ID and email without needing to decode the token again.
     * The type of this property is `MyJwtPayload`, which should be defined elsewhere in the codebase to match the structure of the JWT payload used in authentication.
     */
    user?: JwtPayload;
  }
}
