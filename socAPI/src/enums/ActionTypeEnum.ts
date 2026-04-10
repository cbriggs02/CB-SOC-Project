/**
 * @description Enum representing the various levels of logging severity.
 */
export enum ActionTypeEnum {
    SystemError = 'system_error',
    HttpRequest = 'http_request',
    DataAccess = 'data_access',
    CreateUserSuccess = 'create_user_success',
    CreateUserFailure = 'create_user_failure',
    DeleteUserSuccess = 'delete_user_success',
    DeleteUserFailure = 'delete_user_failure',
    AuthFailure = 'authentication_failure',
    AuthSuccess = 'authentication_success',
    ChangePasswordSuccess = 'change_password_success',
    ChangePasswordFailure = 'change_password_failure',
}
