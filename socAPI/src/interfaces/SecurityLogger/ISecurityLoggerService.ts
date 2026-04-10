import { CreateSecurityLogDTO } from '../../models/DTOs/CreateSecurityLogDTO';

/**
 * @description Interface for security logger services
 */
export interface ISecurityLoggerService {
    /**
     * @description Creates a new security log entry.
     * @param securityLogDTO The data for the security log entry to create.
     */
    createSecurityLog(securityLogDTO: CreateSecurityLogDTO): Promise<void>;
}
