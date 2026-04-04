import dotenv from "dotenv";
import { EnvironmentTypeEnum } from "../enums/EnvironmentTypeEnum";

dotenv.config();

/**
 * The env object centralizes access to environment variables used throughout the application. 
 * It provides default values for each variable, ensuring that the application can run even
 *  if some environment variables are not set. This approach promotes better maintainability and 
 * readability by keeping all environment-related configurations in one place.
 */
export const env = {
    ENV: (process.env.NODE_ENV || EnvironmentTypeEnum.DEVELOPMENT) as EnvironmentTypeEnum,
    PORT: process.env.PORT || "3000",
    DB_HOST: process.env.DB_HOST || "",
    DB_USER: process.env.DB_USER || "",
    DB_PASS: process.env.DB_PASSWORD || "",
    DB_DATABASE: process.env.DB_DATABASE || "",
};