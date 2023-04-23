import express from "express";
import { UserService } from "../services/user-service";
import { UserController } from "../controllers/user-controller";

const userRouter = express.Router();
const userService = new UserService();
const userController = new UserController(userService);

userRouter.get("/users", userController.getAllUsers.bind(userController));
userRouter.post("/users", userController.createUser.bind(userController));

export default userRouter;
