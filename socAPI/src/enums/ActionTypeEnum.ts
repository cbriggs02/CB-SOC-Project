/**
 * Enum representing the various levels of logging severity.
 */
export enum ActionTypeEnum {
    /**
     * Represents a system error, which could be an unexpected exception, failure in a critical operation, or any other issue that indicates a problem with the system's functionality. This type of log is important for identifying and troubleshooting issues that may affect the stability and performance of the application.
     */
    SystemError = 'system_error',

    /**
     * Represents an HTTP request action, which could include details about incoming requests to the application, such as the method, URL, response status code, and duration of the request. This type of log is useful for monitoring and analyzing the traffic and performance of the application, as well as for identifying potential security issues or unusual patterns in incoming requests.
     */
    HttpRequest = 'http_request',

    /**
     * Represents an action related to data access, such as reading or writing data in the application.
     */
    DataAccess = 'data_access',

    /**
     *  Represents an action related to user authentication, such as login attempts, password changes, or account lockouts.
     */
    CreateUserSuccess = 'create_user_success',

    /**
     * Represents a failure in creating a user, which could be due to validation errors, database issues, or other problems that prevent the successful creation of a user account.
     */
    CreateUserFailure = 'create_user_failure',

    /**
     * Represents a successful deletion of a user, indicating that the user account was removed from the system without any issues.
     */
    DeleteUserSuccess = 'delete_user_success',

    /**
     * Represents a failure in deleting a user, which could occur due to reasons such as the user not being found, database constraints, or other issues that prevent the successful removal of a user account.
     */
    DeleteUserFailure = 'delete_user_failure',

    /**
     * Represents a failure in user authentication, which could be due to incorrect credentials, account lockouts, or other issues that prevent a user from successfully logging in or accessing the system.
     */
    AuthenticationFailure = 'authentication_failure',

    /**
     * Represents a successful user authentication, indicating that the user has successfully logged in or accessed the system without any issues.
     */
    AuthenticationSuccess = 'authentication_success',

    /**
     * Represents a successful password change, indicating that the user's password was updated successfully without any issues.
     */
    ChangePasswordSuccess = 'change_password_success',


    /**
     * Represents a failure in changing a user's password, which could be due to reasons such as validation errors, database issues, or other problems that prevent the successful update of the user's password. This type of log is important for monitoring and troubleshooting issues related to password management and user security.
     */
    ChangePasswordFailure = 'change_password_failure'
}
