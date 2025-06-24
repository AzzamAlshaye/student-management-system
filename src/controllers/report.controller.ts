// src/controllers/report.controller.ts

import { Request, Response, NextFunction } from "express"
import { ReportService } from "../service/report.service"
import { CREATED } from "../utils/http-status"

export class ReportController {
  /**
   * Teacher creates a report for a class
   */
  static async createReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: classId } = req.params
      const teacherId = req.user!.id
      const { title, content } = req.body

      const report = await ReportService.createReport({
        classId,
        teacherId,
        title,
        content,
      })

      res.status(CREATED).json(report)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Admin, Principal, or Teacher views reports for a class
   */
  static async getReportsForClass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: classId } = req.params
      const reports = await ReportService.getReportsForClass(classId)
      res.json(reports)
    } catch (err) {
      next(err)
    }
  }
}
