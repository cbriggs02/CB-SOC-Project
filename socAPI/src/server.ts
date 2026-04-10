import { createApp } from './app';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';

/**
 * @description Starts the server by initializing the database connection and then starting the Express application.
 * The server listens on a specified port (defaulting to 3000) and logs a message when it is running.
 * If there is an error during initialization, it logs the error message.
 */
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const app = createApp();
        const port = parseInt(env.PORT, 10);

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
};

startServer();
