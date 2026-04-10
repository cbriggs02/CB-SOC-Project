import { injectable } from 'tsyringe';
import { RequestContextService } from '../../context/RequestContextService';
import { ISecurityLog } from '../../interfaces/SecurityLogger/ISecurityLog';
import { ISecurityLoggerService } from '../../interfaces/SecurityLogger/ISecurityLoggerService';
import { CreateSecurityLogDTO } from '../../models/DTOs/CreateSecurityLogDTO';

/**
 * @description Service for handling security logging. This service is responsible for creating security log entries and sending them to a SIEM system. The createSecurityLog method takes a CreateSecurityLogDTO object, constructs an ISecurityLog object with additional information such as the operating system and timestamp, and returns it. The SendSecurityLogToSIEM method is a placeholder for sending the log data to a SIEM system, which can be implemented as needed.
 */
@injectable()
export class SecurityLoggerService implements ISecurityLoggerService {
    /**
     * @description Creates a security log entry.
     * @param securityLogDTO
     * @returns
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
        await this.sendSecurityLogToSIEM(securityLog);
    }

    /**
     * @description
     * @param securityLog
     */
    private async sendSecurityLogToSIEM(securityLog: ISecurityLog) {
        const logData = JSON.stringify(securityLog);
        // Placeholder for sending logData to a SIEM system
        console.log('Security log sent to SIEM:', logData);
    }
}
