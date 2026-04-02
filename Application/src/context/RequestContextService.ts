import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "../interfaces/context/IRequestContext";

/**
 * 
 */
export class RequestContextService {
    private static storage = new AsyncLocalStorage<RequestContext>();

    /**
     * 
     * @param context 
     * @param callback 
     */
    static run (context: RequestContext, callback: () => void) {
        this.storage.run(context, callback);
    }

    /**
     * 
     * @returns 
     */
    static get (): RequestContext | undefined {
        return this.storage.getStore();
    }

    /**
     * 
     * @returns 
     */
    static getIp (): string | undefined {
        return this.storage.getStore()?.ip;
    }

    /**
     * 
     * @returns 
     */
    static getRequestId (): string | undefined {
        return this.storage.getStore()?.requestId;
    }
}