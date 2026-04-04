import { AppDataSource } from "../config/data-source";
import { UserSeeder } from "./user.seed";
import { env } from "../config/env";
import { EnvironmentTypeEnum } from "../enums/EnvironmentTypeEnum";

/**
 * Runs all seeders to populate the database with initial data. This function checks if the environment 
 * is set to development before proceeding, ensuring that seeding is not accidentally run in production. 
 * It initializes the database connection, runs the user seeder, and logs the progress. 
 * If any errors occur during the process, it logs the error and exits with a failure code.
 */
const runSeeds = async () => {
    if (env.ENV !== EnvironmentTypeEnum.DEVELOPMENT) {
        console.log("Seeding only allowed in development");
        process.exit(0);
    }

    try {
        await AppDataSource.initialize();
        console.log("Database connected");

        const userSeeder = new UserSeeder();
        await userSeeder.seed();

        console.log("Seeding complete");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed", err);
        process.exit(1);
    }
};

runSeeds();