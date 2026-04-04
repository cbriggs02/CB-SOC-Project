/**
 * Enum for different environment types. 
 * This can be used to determine the current environment the application is running in 
 * (e.g., development, production, staging) and adjust configurations or behavior accordingly.
 */
export enum EnvironmentTypeEnum {
    /**
     * Development environment.
     */
    DEVELOPMENT = "development",

    /**
     * Production environment.
     */
    PRODUCTION = "production",

    /**
     * Staging environment.
     */
    STAGING = "staging"
}