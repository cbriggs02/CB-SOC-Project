import dotenv from 'dotenv';
import { EnvironmentTypeEnum } from '../enums/EnvironmentTypeEnum';
import { ENV_KEYS } from '../constants/env.constants';

dotenv.config();
const errors: string[] = [];
type EnvKey = keyof typeof ENV_KEYS;

/**
 * @description Ensures that an environment variable is set and returns its value.
 * @param name
 * @param value
 * @returns
 */
function required(name: EnvKey, value?: string): string {
    if (!value) {
        errors.push(name);
        return '';
    }
    return value;
}

/**
 * @description Configuration object that holds all necessary environment variables for the application. It includes the current environment, database connection details, JWT secret, and other relevant settings. The values are loaded from environment variables and validated to ensure that required configurations are present.
 */
export const env = {
    ENV: (process.env[ENV_KEYS.NODE_ENV] || EnvironmentTypeEnum.DEVELOPMENT) as EnvironmentTypeEnum,
    SWAGGER_ENABLED: process.env[ENV_KEYS.SWAGGER_ENABLED] === 'true',
    PORT: process.env[ENV_KEYS.PORT] || '3000',
    DEV_USER_PASSWORD: process.env[ENV_KEYS.DEV_USER_PASSWORD],

    DB_HOST: required(ENV_KEYS.DB_HOST, process.env[ENV_KEYS.DB_HOST]),
    DB_USER: required(ENV_KEYS.DB_USER, process.env[ENV_KEYS.DB_USER]),
    DB_PASS: required(ENV_KEYS.DB_PASSWORD, process.env[ENV_KEYS.DB_PASSWORD]),
    DB_DATABASE: required(ENV_KEYS.DB_DATABASE, process.env[ENV_KEYS.DB_DATABASE]),
    JWT_SECRET: required(ENV_KEYS.JWT_SECRET, process.env[ENV_KEYS.JWT_SECRET]),
};

if (errors.length > 0) {
    console.error('Missing environment variables:', errors.join(', '));
    process.exit(1);
}
