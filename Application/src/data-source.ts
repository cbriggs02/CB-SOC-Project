import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "./models/User";

dotenv.config();

/**
 * AppDataSource is the main entry point for connecting to the database using TypeORM. It is configured with the necessary connection parameters and entity definitions. The synchronize option is set to true for development purposes, allowing TypeORM to automatically create tables based on the defined entities. In a production environment, this should be set to false to prevent accidental data loss.
 */
export const AppDataSource = new DataSource({
    type: "mssql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // automatically create tables (use false in production)
    logging: true,
    entities: [User],
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
});