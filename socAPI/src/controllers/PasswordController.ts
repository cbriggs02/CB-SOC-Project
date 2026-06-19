import { ChangePasswordDTO } from '../models/DTOs/ChangePasswordDTO';
import { inject, injectable } from 'tsyringe';
import { IPasswordService } from '../interfaces/UserManagement/IPasswordService';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { JsonController, BadRequestError, Body, Param, Patch, Authorized } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { UserRoleEnum } from '../enums/UserRoleEnum';

/**
 * @description Controller for user-related operations. Handles incoming requests, interacts with the user service, and sends appropriate responses.
 */
@injectable()
@JsonController('/api/password')
@OpenAPI({ tags: ['Password Management'] })
export class PasswordController {
    /**
     * @description Initializes a new instance of the PasswordController class.
     * @param passwordService - The service responsible for handling password-related operations, such as validating and changing passwords. This service is injected into the controller using dependency injection, allowing for better separation of concerns and easier testing.
     */
    constructor(@inject(DIContainerTokensEnum.IPasswordService) private readonly passwordService: IPasswordService) {}

    /**
     * @description Changes the password for a user.
     * @param id - The unique identifier of the user whose password is to be changed. This parameter is extracted from the URL path and is used to identify the user in the database.
     * @param dto - The data transfer object containing the current password and the new password. This DTO is validated to ensure that the new password meets the required criteria before being processed by the password service.
     * @returns A response indicating the success or failure of the password change operation. If the new password does not meet validation criteria, a BadRequestError is thrown with the relevant error messages. If the user is not found or if the current password is incorrect, appropriate errors are thrown by the password service, which are then handled and returned as responses to the client. The method also includes OpenAPI documentation for the endpoint, specifying the expected request body and possible responses.
     */
    @Patch('/users/:id/password')
    @Authorized([UserRoleEnum.USER, UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN])
    @OpenAPI({
        summary: 'Changes user password',
        responses: {
            204: { description: 'Password changed successfully' },
            400: { description: 'Validation or policy failure' },
            404: { description: 'User not found' },
        },
    })
    public async changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDTO) {
        const { valid, errors } = await this.passwordService.validatePassword(dto.newPassword);
        if (!valid) {
            throw new BadRequestError(errors.join(', '));
        }

        await this.passwordService.changePassword(id, dto);
        return null;
    }
}
