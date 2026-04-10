/**
 * @description This file defines constants for environment variable keys used in the application.
 */
export const ENV_KEYS = {
    DB_HOST: 'DB_HOST',
    DB_USER: 'DB_USER',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_DATABASE: 'DB_DATABASE',
    JWT_SECRET: 'JWT_SECRET',
    PORT: 'PORT',
    NODE_ENV: 'NODE_ENV',
    SWAGGER_ENABLED: 'SWAGGER_ENABLED',
    DEV_USER_PASSWORD: 'DEV_USER_PASSWORD',
} as const;
