import { ActionTypeEnum } from '../../enums/ActionTypeEnum';
import { LogLevelEnum } from '../../enums/LogLevelEnum';
import { ServiceNameEnum } from '../../enums/ServiceNameEnum';

/**
 * @description Class representing a security log entry.
 */
export class CreateSecurityLogDTO {
    ServiceName!: ServiceNameEnum;
    LogLevel!: LogLevelEnum;
    ActionType!: ActionTypeEnum;
    Message!: string;
}
