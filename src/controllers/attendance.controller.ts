// src/controllers/attendance.controller.ts
import { Request, Response, NextFunction } from "express"
import AttendanceService from "../service/attendance.service"
import { CREATED } from "../utils/http-status"
import { AttendanceStatus } from "../models/attendance.model"

export class AttendanceController {
  static async recordAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const classId = req.params.id
      const { attendeeId, status } = req.body as {
        attendeeId: string
        status: AttendanceStatus
      }

      // Pass status into the service call
      const rec = await AttendanceService.recordAttendance(
        classId,
        attendeeId,
        status
      )

      res.status(CREATED).json(rec)
    } catch (err) {
      next(err)
    }
  }

  /**
   * GET /classes/:id/attendance
   * Optional query: ?date=YYYY-MM-DD or ?from=YYYY-MM-DD&to=YYYY-MM-DD
   */
  static async getAttendanceForClass(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const classId = req.params.id
      const { date, from, to } = req.query as {
        date?: string
        from?: string
        to?: string
      }

      const filters: any = {}
      if (date) filters.date = new Date(date)
      if (from) filters.from = new Date(from)
      if (to) filters.to = new Date(to)

      const recs = await AttendanceService.getAttendanceForClass(
        classId,
        filters
      )
      res.json(recs)
    } catch (err) {
      next(err)
    }
  }
}

export default AttendanceController
