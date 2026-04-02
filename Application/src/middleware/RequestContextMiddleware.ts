import { Request, Response, NextFunction } from "express";
import { RequestContextService } from "../context/RequestContextService";
import { randomUUID } from "crypto";

/**
 * RequestContextMiddleware is an Express middleware that creates a request context for each incoming request. It generates a unique request ID and captures the client's IP address, then stores this information in the RequestContextService using AsyncLocalStorage. This allows the request context to be accessed throughout the application, enabling features like enhanced logging, tracing, and security checks based on the request information.
 */
export class RequestContextMiddleware {
    /**
     * 
     * @param req 
     * @param _res 
     * @param next 
     */
    public use (req: Request, _res: Response, next: NextFunction) {
        const context = {
            ip: req.ip,
            requestId: randomUUID(),
        };

        RequestContextService.run(context, () => next());
    }
}