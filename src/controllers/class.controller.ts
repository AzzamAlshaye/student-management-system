// src/controllers/class.controller.ts
import { Request, Response, NextFunction } from "express"
import { ClassService } from "../service/class.service"
import { CREATED } from "../utils/http-status"

export class ClassController {
  static async createClass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cls = await ClassService.createClass(req.body)
      res.status(CREATED).json(cls)
    } catch (err) {
      next(err)
    }
  }

  static async getClasses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const list = await ClassService.getClasses()
      res.json(list)
    } catch (err) {
      next(err)
    }
  }

  static async getClassById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const cls = await ClassService.getClassById(id)
      if (!cls) {
        res.sendStatus(404)
        return
      }
      res.json(cls)
    } catch (err) {
      next(err)
    }
  }

  static async getClassStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const students = await ClassService.getClassStudents(id)
      res.json(students)
    } catch (err) {
      next(err)
    }
  }

  static async getClassTeachers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const teachers = await ClassService.getClassTeachers(id)
      res.json(teachers)
    } catch (err) {
      next(err)
    }
  }
}
