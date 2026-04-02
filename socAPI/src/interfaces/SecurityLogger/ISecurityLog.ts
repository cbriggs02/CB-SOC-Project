import { ActionTypeEnum } from "../../enums/ActionTypeEnum";
import { LogLevelEnum } from "../../enums/LogLevelEnum";

/**
 * Interface representing a security log entry.
 * This interface defines the structure of a security log, including details about the operating system,
 * service name, IP address, log level, message, and timestamp of the log entry.
 */
export interface ISecurityLog {
    /**
     * The operating system from which the log entry originated, represented as a string (e.g., "Windows", "Linux", "macOS")
     */
    OperatingSystem: string;

    /**
     * The name of the service that generated the log entry, represented as a string
     */
    ServiceName: string;
    /**
     * The IP address from which the log entry originated, represented as a string
     */
    IpAddress: string;

    /**
     * The log level of the entry, represented as a string (e.g., "INFO", "WARN", "ERROR")
     */
    LogLevel: LogLevelEnum;

    /**
     * The type of action that was logged, represented as a string (e.g., "LOGIN", "FILE_ACCESS", "CONFIG_CHANGE")
     */
    ActionType: ActionTypeEnum;

    /**
     * The message associated with the log entry, represented as a string
     */
    Message: string;

    /**
     * The timestamp of when the log entry was created, represented as a Date object
     */
    Timestamp: Date;
}