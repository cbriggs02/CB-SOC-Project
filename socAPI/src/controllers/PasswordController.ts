import { Request, Response } from "express";
import { PasswordService } from "../services/UserManagement/PasswordService";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ChangePasswordDTO } from "../models/DTOs/ChangePasswordDTO";

/**
 * Controller for user-related operations. Handles incoming requests, interacts with the user service, and sends appropriate responses.
 */
export class PasswordController {
    private readonly passwordService = new PasswordService();

    /**
     * Changes the password for a user.
     * @param req 
     * @param res 
     */
    public async changePassword (req: Request<{ userId: string }>, res: Response) {
        const { userId } = req.params;
        const dto = plainToInstance(ChangePasswordDTO, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const messages = errors.flatMap(err => Object.values(err.constraints || {}));
            return res.status(400).json({ errors: messages });
        }

        await this.passwordService.changePassword(userId, dto);
        res.json({ message: "Password changed successfully" });
    }
}