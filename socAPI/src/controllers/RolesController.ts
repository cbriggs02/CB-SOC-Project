import { Authorized, Body, JsonController, Param, Patch } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { inject, injectable } from 'tsyringe';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { IRoleService } from '../interfaces/Authorization/IRoleService';
import { AssignRoleDTO } from '../models/DTOs/AssignRoleDTO';
import { UserRoleEnum } from '../enums/UserRoleEnum';

/**
 * @description Controller for role-related operations. Handles incoming requests, interacts with the role service, and sends appropriate responses.
 */
@injectable()
@JsonController('/api/role')
@OpenAPI({ tags: ['Role Management'] })
export class RolesController {
    /**
     * @description Initializes a new instance of the RolesController class.
     * @param roleService - The service responsible for handling role-related operations, such as assigning roles to users. This service is injected into the controller using dependency injection, allowing for better separation of concerns and easier testing.
     */
    constructor(@inject(DIContainerTokensEnum.IRoleService) private readonly roleService: IRoleService) {}

    /**
     * @description Assigns a role to a user. This method takes the user's unique identifier from the URL path and the role information from the request body. It validates the input and then calls the role service to perform the role assignment. If the operation is successful, it returns a response indicating that the role was changed successfully. If there are validation errors or if the user is not found, it throws appropriate errors that are handled and returned as responses to the client. The method also includes OpenAPI documentation for the endpoint, specifying the expected request body and possible responses.
     * @param id - The unique identifier of the user to whom the role will be assigned. This parameter is extracted from the URL path and is used to identify the user in the database.
     * @param dto - The data transfer object containing the role information to be assigned to the user. This DTO is validated to ensure that the provided role is valid before being processed by the role service.
     * @returns A response indicating the success or failure of the role assignment operation. If the role is assigned successfully, it returns a 204 No Content response. If there are validation errors or if the user is not found, appropriate errors are thrown by the role service, which are then handled and returned as responses to the client. The method also includes OpenAPI documentation for the endpoint, specifying the expected request body and possible responses.
     */
    @Patch('/users/:id/role')
    @Authorized([UserRoleEnum.SUPER_ADMIN])
    @OpenAPI({
        summary: 'Changes user role',
        responses: {
            204: { description: 'Role changed successfully' },
            400: { description: 'Validation or policy failure' },
            404: { description: 'User not found' },
        },
    })
    public async assignRole(@Param('id') id: string, @Body() dto: AssignRoleDTO) {
        await this.roleService.AssignRole(id, dto.role);
        return null;
    }
}
