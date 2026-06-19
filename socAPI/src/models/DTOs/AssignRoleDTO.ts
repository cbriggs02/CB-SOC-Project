import { IsEnum } from 'class-validator';
import { UserRoleEnum } from '../../enums/UserRoleEnum';

/**
 * @description Data Transfer Object (DTO) for assigning a role to a user. This class defines the structure of the data required to assign a role, which includes a single property 'role' that must be a valid value from the UserRoleEnum. The IsEnum decorator from class-validator is used to enforce that the provided role is one of the defined enum values, ensuring data integrity and preventing invalid role assignments. This DTO can be used in controller methods to validate incoming requests for role assignment operations.
 */
export class AssignRoleDTO {
    @IsEnum(UserRoleEnum, { message: 'Invalid role provided' })
    role!: UserRoleEnum;
}
