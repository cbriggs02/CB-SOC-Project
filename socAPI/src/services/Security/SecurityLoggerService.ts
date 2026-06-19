import { injectable } from 'tsyringe';
import { RequestContextService } from '../../context/RequestContextService';
import { ISecurityLog } from '../../interfaces/SecurityLogger/ISecurityLog';
import { ISecurityLoggerService } from '../../interfaces/SecurityLogger/ISecurityLoggerService';
import { CreateSecurityLogDTO } from '../../models/DTOs/CreateSecurityLogDTO';
import { env } from '../../config/env';
import { EnvironmentTypeEnum } from '../../enums/EnvironmentTypeEnum';

/**
 * @description Service for handling security logging. This service is responsible for creating security log entries and sending them to a SIEM system. The createSecurityLog method takes a CreateSecurityLogDTO object, constructs an ISecurityLog object with additional information such as the operating system and timestamp, and returns it. The SendSecurityLogToSIEM method is a placeholder for sending the log data to a SIEM system, which can be implemented as needed.
 */
@injectable()
export class SecurityLoggerService implements ISecurityLoggerService {
    /**
     * @description Creates a security log entry.
     * @param securityLogDTO - The data transfer object containing information about the security event to be logged.
     * @returns A promise that resolves when the security log has been created and sent to the SIEM system. The method constructs an ISecurityLog object using the information from the CreateSecurityLogDTO and additional context such as the operating system and IP address, then sends it to the SIEM system. If the environment is not production, it also logs the security event to the console for debugging purposes.
     */
    public async createSecurityLog(securityLogDTO: CreateSecurityLogDTO): Promise<void> {
        const securityLog: ISecurityLog = {
            OperatingSystem: process.platform ?? 'Unknown',
            ServiceName: securityLogDTO.ServiceName,
            IpAddress: RequestContextService.getIp() ?? 'Unknown',
            LogLevel: securityLogDTO.LogLevel,
            ActionType: securityLogDTO.ActionType,
            Message: securityLogDTO.Message,
            Timestamp: new Date(),
        };

        this.debugLog(securityLog);
        await this.sendSecurityLogToSIEM(securityLog);
    }

    private async sendSecurityLogToSIEM(securityLog: ISecurityLog) {
        const logData = JSON.stringify(securityLog);
    }

    private debugLog(securityLog: ISecurityLog) {
        if (env.ENV !== EnvironmentTypeEnum.PRODUCTION) {
            console.log('[SECURITY LOG DEBUG]', securityLog);
        }
    }
}
