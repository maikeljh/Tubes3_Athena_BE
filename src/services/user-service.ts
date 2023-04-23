import { Prisma, User } from "@prisma/client";
import prisma from "../../prisma/prisma-client";

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const allUsers = await prisma.user.findMany();
    return allUsers;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      },
    });
    return createdUser;
  }
}
