// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from "express"
import UserService from "../service/user.service"
import { UserRole } from "../models/user.model"

export class UserController {
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.createUser(req.body)
      res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  }

  static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const me = req.user as { id: string; role: UserRole }
      let users
      switch (me.role) {
        case "admin":
          users = await UserService.getAllUsers()
          break
        case "principal":
          users = await UserService.getUsersByRole(["teacher", "student"])
          break
        case "teacher":
          users = await UserService.getRelatedStudents(me.id)
          break
        case "student":
          users = await UserService.getRelatedTeachers(me.id)
          break
        default:
          res.sendStatus(403)
          return
      }
      res.json(users)
    } catch (err) {
      next(err)
    }
  }

  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const user = await UserService.getUserById(id)
      if (!user) {
        res.sendStatus(404)
        return
      }
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const updated = await UserService.updateUser(id, req.body)
      if (!updated) {
        res.sendStatus(404)
        return
      }
      res.json(updated)
    } catch (err) {
      next(err)
    }
  }

  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const deleted = await UserService.deleteUser(id)
      if (!deleted) {
        res.sendStatus(404)
        return
      }
      res.sendStatus(204)
    } catch (err) {
      next(err)
    }
  }

  // ─── Leaves ─────────────────────────────────────────

  static async getUserLeaves(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params
      const leaves = await UserService.getUserLeaves(userId)
      res.json(leaves)
    } catch (err) {
      next(err)
    }
  }

  static async acceptLeave(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, leaveId } = req.params
      const leave = await UserService.acceptLeave(userId, leaveId)
      if (!leave) {
        res.sendStatus(404)
        return
      }
      res.json(leave)
    } catch (err) {
      next(err)
    }
  }

  static async rejectLeave(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, leaveId } = req.params
      const leave = await UserService.rejectLeave(userId, leaveId)
      if (!leave) {
        res.sendStatus(404)
        return
      }
      res.json(leave)
    } catch (err) {
      next(err)
    }
  }
}

export default UserController
