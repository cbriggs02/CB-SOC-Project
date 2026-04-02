/**
 * RequestContext interface defines the structure of the context object that will be used to store information about the current request, such as the IP address, user ID, and request ID. This context can be accessed throughout the application to provide additional information for logging, security checks, and other purposes.
 */
export interface RequestContext {

    /**
     * The IP address of the client making the request. This can be used for logging, security checks, and other purposes.
     */
    ip?: string;

    /**
     * The user ID associated with the request. This can be set by authentication middleware after verifying the user's identity. It can be used for logging, security checks, and other purposes.
     */
    userId?: string;

    /**
     * A unique identifier for the request. This can be generated at the start of the request and used for tracing the request through the application, logging, and debugging purposes.
     */
    requestId?: string;
}