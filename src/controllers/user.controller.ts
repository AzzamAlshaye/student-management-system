import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import UserService from "../service/user.service"
import { UserRole } from "../models/user.model"
import { CREATED, OK } from "../utils/http-status"

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const user = await UserService.createUser(req.body)
      res.status(CREATED).json(user)
    } catch (err) {
      next(err)
    }
  }

  static async getUsers(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) {
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

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const user = await UserService.getUserById(req.params.id)
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const updated = await UserService.updateUser(req.params.id, req.body)
      res.json(updated)
    } catch (err) {
      next(err)
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

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

  // “Me” and sub-routes don’t need additional body/param validation, since they rely on auth/userId from middleware:
  static async getMyTeachers(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) {
    try {
      const me = req.user as { id: string; role: UserRole }
      const teachers = await UserService.getRelatedTeachers(me.id)
      res.json(teachers)
    } catch (err) {
      next(err)
    }
  }

  static async getMyStudents(
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) {
    try {
      const me = req.user as { id: string; role: UserRole }
      const students = await UserService.getRelatedStudents(me.id)
      res.json(students)
    } catch (err) {
      next(err)
    }
  }

  static async getRelatedStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    try {
      const students = await UserService.getRelatedStudents(req.params.userId)
      res.json(students)
    } catch (err) {
      next(err)
    }
  }

  static async getRelatedTeachers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    try {
      const teachers = await UserService.getRelatedTeachers(req.params.userId)
      res.json(teachers)
    } catch (err) {
      next(err)
    }
  }

  static async getUserLeaves(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    try {
      const leaves = await UserService.getUserLeaves(req.params.userId)
      res.json(leaves)
    } catch (err) {
      next(err)
    }
  }

  static async acceptLeave(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
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

  static async rejectLeave(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
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
