import 'reflect-metadata';
import express from 'express';
import { registerDependencies } from './dependency-injection/container';
import { RequestLoggerMiddleware } from './middleware/RequestLoggerMiddleware';
import { GlobalErrorMiddleware } from './middleware/GlobalErrorMiddleware';
import { RequestContextMiddleware } from './middleware/RequestContextMiddleware';
import swaggerUi from 'swagger-ui-express';
import { container } from 'tsyringe';
import { env } from './config/env';
import { getSwaggerSpec } from './config/swagger';
import { useContainer, useExpressServer } from 'routing-controllers';
import { controllers } from './controllers';
import { AuthMiddleware } from './middleware/AuthMiddleware';

/**
 * @description Creates the Express application with all configured routes and middleware.
 * @returns The configured Express application instance.
 */
export function createApp() {
    registerDependencies();

    const containerAdapter = {
        get: <T>(someClass: any) => container.resolve<T>(someClass),
    };
    useContainer(containerAdapter);

    const app = express();
    useExpressServer(app, {
        controllers,
        middlewares: [RequestContextMiddleware, RequestLoggerMiddleware, AuthMiddleware, GlobalErrorMiddleware],
        authorizationChecker: async (action, roles) => {
            const user = action.request.user;
            if (!user) {
                return false;
            }
            if (roles.length === 0) {
                return true;
            }
            return roles.includes(user.role);
        },

        currentUserChecker: async (action) => {
            return action.request.user;
        },
        validation: true,
        classTransformer: true,
        defaultErrorHandler: false,
    });

    if (env.SWAGGER_ENABLED) {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(getSwaggerSpec()));
    }

    return app;
}
