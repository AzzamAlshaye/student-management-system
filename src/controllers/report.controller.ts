// src/controllers/report.controller.ts
import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { ReportService } from "../service/report.service"
import { ClassService } from "../service/class.service"
import { CREATED } from "../utils/http-status"

export class ReportController {
  static async createReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const { id: classId } = req.params
      // ensure class exists
      const cls = await ClassService.getClassById(classId)
      if (!cls) {
        res.status(404).json({
          errors: [{ msg: "Class not found" }],
        })
        return
      }

      const teacherId = req.user!.id
      const { title, content } = req.body
      const report = await ReportService.createReport({
        classId,
        teacherId,
        title,
        content,
      })
      res.status(CREATED).json(report)
      // <-- no `return` here
    } catch (err) {
      next(err)
    }
  }

  static async getReportsForClass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    try {
      const { id: classId } = req.params
      // ensure class exists
      const cls = await ClassService.getClassById(classId)
      if (!cls) {
        res.status(404).json({
          errors: [{ msg: "Class not found" }],
        })
        return
      }

      const reports = await ReportService.getReportsForClass(classId)
      res.json(reports)
      // <-- no `return` here
    } catch (err) {
      next(err)
    }
  }
}
