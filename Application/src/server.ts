import express, { Application } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/userRoutes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { RequestContextMiddleware } from "./middleware/RequestContextMiddleware";
import { RequestLoggerMiddleware } from "./middleware/RequestLoggerMiddleware";
import { GlobalErrorHandler } from "./middleware/GlobalErrorHandler";

dotenv.config();

/**
 * Server class is responsible for setting up and starting the Express application. It initializes middlewares,
 *  Swagger documentation, routes, and the database connection. The server listens on a specified port and provides
 *  an endpoint for API documentation at /api-docs. The root endpoint (/) returns a simple message 
 * indicating that the SOC API is running.
 */
export class Server {
    public app: Application;
    private port: number;
    private baseUrl: string;

    /**
     * Initializes the Server by setting up the Express application, configuring the port and base URL,
     *  and calling methods to initialize middlewares, Swagger documentation, routes, and the database connection.
     */
    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || "3000", 10);
        this.baseUrl = process.env.BASE_URL || `http://localhost:${this.port}`;
        this.initializeMiddlewares();
        this.initializeSwagger();
        this.initializeRoutes();
        this.initializeDatabase();
    }

    private initializeMiddlewares () {
        this.app.set("trust proxy", true);
        this.app.use(express.json());

        const contextMiddleware = new RequestContextMiddleware();
        this.app.use(contextMiddleware.use.bind(contextMiddleware));

        const requestLogger = new RequestLoggerMiddleware();
        this.app.use(requestLogger.use);

        this.initializeRoutes();
        const globalErrorHandler = new GlobalErrorHandler();
        this.app.use(globalErrorHandler.handle);
    }

    private initializeSwagger () {
        const swaggerOptions = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "SOC API",
                    version: "1.0.0",
                    description: "API documentation for the SOC project",
                },
                servers: [{ url: this.baseUrl }],
            },
            apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
        };

        const swaggerSpec = swaggerJsdoc(swaggerOptions);
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    private initializeRoutes () {
        this.app.get("/", (_req, res) => res.send("SOC API running"));
        this.app.use("/users", userRoutes);
    }

    private async initializeDatabase () {
        try {
            await AppDataSource.initialize();
            console.log("Database connected");
            this.listen();
        } catch (err) {
            console.error("DB connection failed", err);
        }
    }

    private listen () {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}
new Server();