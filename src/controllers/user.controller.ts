// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from "express"
import UserService from "../service/user.service"
import { UserRole } from "../models/user.model"
import { CREATED, OK } from "../utils/http-status"

export class UserController {
  /** Create a new user */
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.createUser(req.body)
      res.status(CREATED).json(user)
    } catch (err) {
      next(err)
    }
  }

  /** List users (RBAC based on req.user.role) */
  static async getUsers(
    req: Request & { user?: any },
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

  /** Get a single user by ID (_id or custom id) */
  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id)
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  /** Update a user by ID */
  static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updated = await UserService.updateUser(req.params.id, req.body)
      res.json(updated)
    } catch (err) {
      next(err)
    }
  }

  /** Delete a user by ID, returning the deleted document */
  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const deletedUser = await UserService.deleteUser(req.params.id)
      res.status(OK).json({
        success: true,
        message: "User deleted successfully",
        user: deletedUser,
      })
    } catch (err) {
      next(err)
    }
  }

  // ─── Leaves Endpoints ───────────────────────────────────

  /** List all leave records for a user */
  static async getUserLeaves(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const leaves = await UserService.getUserLeaves(req.params.userId)
      res.json(leaves)
    } catch (err) {
      next(err)
    }
  }

  /** Accept a specific leave */
  static async acceptLeave(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const leave = await UserService.acceptLeave(
        req.params.userId,
        req.params.leaveId
      )
      res.json(leave)
    } catch (err) {
      next(err)
    }
  }

  /** Reject a specific leave */
  static async rejectLeave(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const leave = await UserService.rejectLeave(
        req.params.userId,
        req.params.leaveId
      )
      res.json(leave)
    } catch (err) {
      next(err)
    }
  }
}

export default UserController
