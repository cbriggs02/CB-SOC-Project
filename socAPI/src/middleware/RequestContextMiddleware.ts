import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../context/RequestContextService';
import { randomUUID } from 'crypto';

/**
 * @description RequestContextMiddleware is an Express middleware that creates a request context for each incoming request. It generates a unique request ID and captures the client's IP address, then stores this information in the RequestContextService using AsyncLocalStorage. This allows the request context to be accessed throughout the application, enabling features like enhanced logging, tracing, and security checks based on the request information.
 */
export class RequestContextMiddleware {
    /**
     * @description Express middleware function that creates a request context for each incoming request. It generates a unique request ID and captures the client's IP address, then stores this information in the RequestContextService using AsyncLocalStorage. This allows the request context to be accessed throughout the application, enabling features like enhanced logging, tracing, and security checks based on the request information.
     * @param req - The Express request object, which contains information about the incoming HTTP request, such as the client's IP address. This information is used to build the request context that will be stored in the RequestContextService.
     * @param _res - The Express response object, which is not used in this middleware but is included to conform to the Express middleware signature.
     * @param next - The next middleware function in the Express middleware stack. This parameter is used to pass control to the next middleware function after the request context has been created and stored.
     */
    public use(req: Request, _res: Response, next: NextFunction) {
        const context = {
            ip: req.ip,
            requestId: randomUUID(),
        };
        RequestContextService.run(context, () => next());
    }
}
