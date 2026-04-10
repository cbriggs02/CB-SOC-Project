import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ChangePasswordDTO } from '../models/DTOs/ChangePasswordDTO';
import { inject, injectable } from 'tsyringe';
import { IPasswordService } from '../interfaces/UserManagement/IPasswordService';
import { DIContainerTokensEnum } from '../enums/DIContainerTokensEnum';
import { JsonController, BadRequestError, Body, Param, Patch } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi/build/decorators';

/**
 * @description Controller for user-related operations. Handles incoming requests, interacts with the user service, and sends appropriate responses.
 */
@injectable()
@JsonController('/api/password')
@OpenAPI({ tags: ['Password Management'] })
export class PasswordController {
    /**
     * @description Initializes a new instance of the PasswordController class.
     * @param passwordService
     */
    constructor(
        @inject(DIContainerTokensEnum.IPasswordService)
        private readonly passwordService: IPasswordService,
    ) {}

    /**
     * @description Changes the password for a user.
     * @param id
     * @param body
     * @returns
     */
    @Patch('/users/:id/password')
    @OpenAPI({
        summary: 'Changes user password',
        responses: {
            204: { description: 'Password changed successfully' },
            400: { description: 'Validation or policy failure' },
            404: { description: 'User not found' },
        },
    })
    public async changePassword(@Param('id') id: string, @Body() body: ChangePasswordDTO) {
        const dto = plainToInstance(ChangePasswordDTO, body);
        const dtoErrors = await validate(dto);

        if (dtoErrors.length > 0) {
            const messages = dtoErrors.flatMap((err) => Object.values(err.constraints || {}));
            throw new BadRequestError(messages.join(', '));
        }

        const { valid, errors } = await this.passwordService.validatePassword(dto.newPassword);
        if (!valid) {
            throw new BadRequestError(errors.join(', '));
        }

        await this.passwordService.changePassword(id, dto);
        return null;
    }
}
