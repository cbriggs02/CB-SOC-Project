import express, { Application } from "express";
import userRoutes from "./routes/userRoutes";
import passwordRoutes from "./routes/passwordRoutes";
import swaggerUi from "swagger-ui-express";
import { RequestContextMiddleware } from "./middleware/RequestContextMiddleware";
import { RequestLoggerMiddleware } from "./middleware/RequestLoggerMiddleware";
import { GlobalErrorHandler } from "./middleware/GlobalErrorHandler";
import path from "path";
import YAML from "yamljs";

/**
 * Creates and configures the Express application.
 * @returns The configured Express application.
 */
export const createApp = (): Application => {
    const app = express();

    app.set("trust proxy", true);
    app.use(express.json());

    // Middleware
    const contextMiddleware = new RequestContextMiddleware();
    app.use(contextMiddleware.use.bind(contextMiddleware));
    const requestLogger = new RequestLoggerMiddleware();
    app.use(requestLogger.use);

    // Swagger
    const swaggerDocument = YAML.load(path.join(__dirname, "../swagger/swagger.yaml"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Routes
    app.get("/", (_req, res) => res.send("SOC API running"));
    app.use("/api/users", userRoutes);
    app.use("/api/users", passwordRoutes);

    // Error handle
    const globalErrorHandler = new GlobalErrorHandler();
    app.use(globalErrorHandler.handle);
    return app;
};