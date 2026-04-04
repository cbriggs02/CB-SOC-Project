import { Router } from "express";
import { PasswordController } from "../controllers/PasswordController";

/**
 * PasswordRoutes sets up password-related endpoints.
 */
class PasswordRoutes {
    /**
     * The Express router for password-related routes.
     */
    public router: Router;
    private passwordController: PasswordController;

    /**
     * Initializes the router and password controller, and sets up the routes for password operations.
     */
    constructor() {
        this.router = Router();
        this.passwordController = new PasswordController();
        this.initializeRoutes();
    }

    private initializeRoutes () {
        this.router.patch("/:userId/password", this.passwordController.changePassword.bind(this.passwordController));
    }
}

export default new PasswordRoutes().router;