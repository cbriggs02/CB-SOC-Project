/**
 * Enum representing the names of services in the application.
 * This enum is used to standardize the naming of services across the application, making it easier to reference and manage them.
 */
export enum ServiceNameEnum {
    /**
     * Represents the API service, which is responsible for handling incoming HTTP requests, routing them to the appropriate controllers, and returning responses to clients. This service acts as the main entry point for client interactions with the application.
     */
    API = "CB-SOC-API",

    /**
     * Represents the User Service, which is responsible for handling user-related operations such as creating, retrieving, updating, and deleting user information.
     */
    UserService = "UserService",

    /**
     * Represents the Security Log Service, which is responsible for handling operations related to security logging, such as recording security events, retrieving logs, and managing log data.
     */
    AuthenticationService = "AuthenticationService",

    /**
     * Represents the Parameter Validator Service, which is responsible for validating input parameters for various operations in the application, ensuring that they meet the required criteria and formats before processing.
     */
    SecurityLogService = "SecurityLogService",

    /**
     * Represents the Parameter Validator Service, which is responsible for validating input parameters for various operations in the application, ensuring that they meet the required criteria and formats before processing.
     */
    ParameterValidatorService = "ParameterValidatorService"
}