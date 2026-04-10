import { AsyncLocalStorage } from 'async_hooks';
import { RequestContext } from '../interfaces/context/IRequestContext';

/**
 * @description
 */
export class RequestContextService {
    private static storage = new AsyncLocalStorage<RequestContext>();

    /**
     * @description
     * @param context
     * @param callback
     */
    static run(context: RequestContext, callback: () => void) {
        this.storage.run(context, callback);
    }

    /**
     * @description
     * @returns
     */
    static get(): RequestContext | undefined {
        return this.storage.getStore();
    }

    /**
     * @description
     * @returns
     */
    static getIp(): string | undefined {
        return this.storage.getStore()?.ip;
    }

    /**
     * @description
     * @returns
     */
    static getRequestId(): string | undefined {
        return this.storage.getStore()?.requestId;
    }
}
