import { ActionTypeEnum } from '../../enums/ActionTypeEnum';
import { LogLevelEnum } from '../../enums/LogLevelEnum';

/**
 * @description Interface representing a security log entry.
 * This interface defines the structure of a security log, including details about the operating system,
 * service name, IP address, log level, message, and timestamp of the log entry.
 */
export interface ISecurityLog {
    OperatingSystem: string;
    ServiceName: string;
    IpAddress: string;
    LogLevel: LogLevelEnum;
    ActionType: ActionTypeEnum;
    Message: string;
    Timestamp: Date;
}
