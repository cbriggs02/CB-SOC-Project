import { Router } from "express";
import { UserController } from "../controllers/UserController";

/**
 * UserRoutes sets up user-related endpoints.
 * All errors are handled by the global error handler.
 */
class UserRoutes {
    /**
     * The Express router for user-related routes.
     */
    public router: Router;
    private userController: UserController;

    /**
     * Initializes the router and user controller, and sets up the routes for user operations.
     */
    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes () {
        this.router.post("/", this.userController.createUser.bind(this.userController));
        this.router.get("/", this.userController.getUsers.bind(this.userController));
        this.router.get("/:id", this.userController.getUser.bind(this.userController));
        this.router.delete("/:id", this.userController.deleteUser.bind(this.userController));
    }
}

export default new UserRoutes().router;