import { AppDataSource } from '../config/data-source';
import { UserSeeder } from './user.seed';
import { env } from '../config/env';
import { EnvironmentTypeEnum } from '../enums/EnvironmentTypeEnum';
import { container } from 'tsyringe';
import { registerDependencies } from '../dependency-injection/container';

/**
 * @description Runs all seeders to populate the database with initial data. This function checks if the environment
 * is set to development before proceeding, ensuring that seeding is not accidentally run in production.
 * It initializes the database connection, runs the user seeder, and logs the progress.
 * If any errors occur during the process, it logs the error and exits with a failure code.
 */
const runSeeds = async () => {
    if (env.ENV !== EnvironmentTypeEnum.DEVELOPMENT) {
        console.log('[SEED] Seeding only allowed in development');
        process.exit(0);
    }

    try {
        console.log('[SEED] Initializing database...');
        await AppDataSource.initialize();

        console.log('[SEED] Database connected');

        registerDependencies();

        console.log('[SEED] Running user seeder...');
        const userSeeder = container.resolve(UserSeeder);
        await userSeeder.seed();

        console.log('[SEED] Seeding complete');

        process.exit(0);
    } catch (err) {
        console.error('[SEED] Seeding failed', err);
        process.exit(1);
    }
};
runSeeds();
