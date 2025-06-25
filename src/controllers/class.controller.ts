import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { ClassService } from "../service/class.service"
import { CREATED } from "../utils/http-status"

export class ClassController {
  static async createClass(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const cls = await ClassService.createClass(req.body)
      res.status(CREATED).json(cls)
    } catch (err) {
      next(err)
    }
  }

  static async getClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ClassService.getClasses()
      res.json(list)
    } catch (err) {
      next(err)
    }
  }

  static async getClassById(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

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
}
