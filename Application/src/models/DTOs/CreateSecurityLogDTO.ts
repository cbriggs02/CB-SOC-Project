import { ActionTypeEnum } from "../../enums/ActionTypeEnum";
import { LogLevelEnum } from "../../enums/LogLevelEnum";
import { ServiceNameEnum } from "../../enums/ServiceNameEnum";

/**
 * Class representing a security log entry.
 */
export class CreateSecurityLogDTO {

    /**
     * The name of the service that generated the log entry, represented as a string
     */
    ServiceName!: ServiceNameEnum;

    /**
     * The log level of the entry, represented as a string (e.g., "INFO", "WARN", "ERROR")
     */
    LogLevel!: LogLevelEnum;

    /**
     * The type of action that was logged, represented as a string (e.g., "LOGIN", "FILE_ACCESS", "CONFIG_CHANGE")
     */
    ActionType!: ActionTypeEnum;

    /**
     * The message associated with the log entry, represented as a string
     */
    Message!: string;
}