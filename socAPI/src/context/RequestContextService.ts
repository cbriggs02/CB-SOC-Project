import { AsyncLocalStorage } from 'async_hooks';
import { RequestContext } from '../interfaces/context/IRequestContext';

/**
 * @description Service for managing request context using AsyncLocalStorage. This service allows storing and retrieving contextual information about the current request, such as the client's IP address and a unique request ID. The run method is used to execute a callback function within a specific context, while the get, getIp, and getRequestId methods provide access to the stored context information. This is particularly useful for logging and tracking requests throughout their lifecycle in the application.
 */
export class RequestContextService {
    private static storage = new AsyncLocalStorage<RequestContext>();

    /**
     * @description Runs a callback function within a specific request context. This method initializes the AsyncLocalStorage with the provided context and executes the callback function, allowing any code executed within the callback to access the context information using the get, getIp, or getRequestId methods.
     * @param context - The request context to be set for the duration of the callback execution, which may include properties such as ip, userId, and requestId.
     * @param callback - The function to be executed within the provided request context. This function can perform any operations that require access to the request context, such as logging or handling the request.
     */
    static run(context: RequestContext, callback: () => void) {
        this.storage.run(context, callback);
    }

    /**
     * @description Retrieves the current request context stored in AsyncLocalStorage. This method returns the context object that was set for the current execution flow, allowing access to properties such as ip, userId, and requestId. If no context is set for the current execution, it returns undefined.
     * @returns The current request context object containing properties like ip, userId, and requestId, or undefined if no context is set for the current execution flow.
     */
    static get(): RequestContext | undefined {
        return this.storage.getStore();
    }

    /**
     * @description Retrieves the client's IP address from the current request context. This method accesses the stored context and returns the ip property, which represents the client's IP address. If no context is set or if the ip property is not defined, it returns undefined.
     * @returns The client's IP address from the current request context, or undefined if no context is set or if the ip property is not defined. This information can be used for logging, security checks, or other purposes that require knowledge of the client's IP address.
     */
    static getIp(): string | undefined {
        return this.storage.getStore()?.ip;
    }

    /**
     * @description Retrieves the unique request ID from the current request context. This method accesses the stored context and returns the requestId property, which represents a unique identifier for the current request. If no context is set or if the requestId property is not defined, it returns undefined. The request ID can be used for tracking and correlating logs related to a specific request throughout its lifecycle in the application.
     * @returns The unique request ID from the current request context, or undefined if no context is set or if the requestId property is not defined. This information is useful for tracking and correlating logs related to a specific request across different parts of the application.
     */
    static getRequestId(): string | undefined {
        return this.storage.getStore()?.requestId;
    }
}
