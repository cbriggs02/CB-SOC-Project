import { DataSource } from "typeorm";
import { User } from "../models/User";
import { env } from "./env";

/**
 * AppDataSource is the main entry point for connecting to the database using TypeORM. It is configured with the necessary connection parameters and entity definitions. The synchronize option is set to true for development purposes, allowing TypeORM to automatically create tables based on the defined entities. In a production environment, this should be set to false to prevent accidental data loss.
 */
export const AppDataSource = new DataSource({
    type: "mssql",
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_DATABASE,
    synchronize: true, // Set to false in production to prevent data loss
    logging: true,
    entities: [User],
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
});