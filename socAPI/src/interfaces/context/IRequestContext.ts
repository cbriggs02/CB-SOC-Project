/**
 * @description RequestContext interface defines the structure of the context object that will be used to store information about the current request,
 * such as the IP address, user ID, and request ID. This context can be accessed throughout the application to provide additional information for logging, security checks, and other purposes.
 */
export interface RequestContext {
    ip?: string;
    userId?: string;
    requestId?: string;
}
