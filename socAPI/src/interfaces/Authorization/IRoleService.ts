import { UserRoleEnum } from '../../enums/UserRoleEnum';

/**
 * @description IRoleService defines the contract for role management operations, specifically for assigning roles to users. The AssignRole method takes a user ID and a role name, and is responsible for updating the user's role in the system. This interface abstracts the underlying implementation details of how roles are assigned, allowing for flexibility in how roles are managed and stored (e.g., in a database, an external service, etc.). Implementing this interface ensures that any class that provides role management functionality adheres to a consistent method signature for assigning roles.
 */
export interface IRoleService {
    /**
     * @description Assigns a role to a user.
     * @param id - The unique identifier of the user to whom the role will be assigned.
     * @param roleName - The name of the role to be assigned to the user, represented as a value from the UserRoleEnum.
     * @returns A promise that resolves when the role assignment is complete. The method does not return any value upon successful completion.
     */
    AssignRole(id: string, roleName: UserRoleEnum): Promise<void>;
}
