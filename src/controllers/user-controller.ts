import { Request, Response } from "express";
import { UserService } from "../services/user-service";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const allUsers = await this.userService.getAllUsers();
      res.status(200).json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const createdUser = await this.userService.createUser(data);
      res.status(201).json(createdUser);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
