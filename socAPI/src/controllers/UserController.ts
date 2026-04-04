import { Request, Response } from "express";
import { UserService } from "../services/UserManagement/UserService";
import { CreateUserDTO } from "../models/DTOs/CreateUserDTO";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

/**
 * Controller for user-related operations. Handles incoming requests, interacts with the user service, and sends appropriate responses.
 */
export class UserController {
    private readonly userService = new UserService();

    /**
     * Creates a new user
     * @param req 
     * @param res 
     */
    public async createUser (req: Request, res: Response) {
        const dto = plainToInstance(CreateUserDTO, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const messages = errors.flatMap(err => Object.values(err.constraints || {}));
            return res.status(400).json({ errors: messages });
        }

        const user = await this.userService.createUser(dto);
        res.status(201).json({ message: "User created successfully", id: user.id });
    }

    /**
     * Gets all users
     * @param _req 
     * @param res 
     */
    public async getUsers (_req: Request, res: Response) {
        const users = await this.userService.getUsers();
        res.json(users);
    }

    /**
     * Retrieves a user by ID
     * @param req 
     * @param res 
     */
    public async getUser (req: Request<{ id: string }>, res: Response) {
        const user = await this.userService.getUser(req.params.id);
        res.json(user);
    }

    /**
     * Deletes a user by ID
     * @param req 
     * @param res 
     */
    public async deleteUser (req: Request<{ id: string }>, res: Response) {
        await this.userService.deleteUser(req.params.id);
        res.status(204).send()
    }
}
