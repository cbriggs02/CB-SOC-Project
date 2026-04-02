import { Router } from "express";
import { UserController } from "../controllers/UserController";

/**
 * UserRoutes sets up user-related endpoints.
 * All errors are handled by the global error handler.
 */
class UserRoutes {
    public router: Router;
    private userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes () {
        /**
         * @openapi
         * /users:
         *   post:
         *     summary: Create a new user
         *     tags:
         *       - Users
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateUserDTO'
         *     responses:
         *       201:
         *         description: User created successfully
         *       400:
         *         description: Validation errors
         */
        this.router.post("/", this.userController.createUser.bind(this.userController));

        /**
         * @openapi
         * /users:
         *   get:
         *     summary: Get all users
         *     tags:
         *       - Users
         *     responses:
         *       200:
         *         description: List of users
         */
        this.router.get("/", this.userController.getUsers.bind(this.userController));

        /**
         * @openapi
         * /users/{id}:
         *   delete:
         *     summary: Delete a user by ID
         *     tags:
         *       - Users
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the user to delete
         *     responses:
         *       204:
         *         description: User deleted successfully
         *       404:
         *         description: User not found
         *       400:
         *         description: Invalid ID
         */
        this.router.delete("/:id", this.userController.deleteUser.bind(this.userController));
    }
}

export default new UserRoutes().router;