import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import AttendanceService from "../service/attendance.service"
import { CREATED } from "../utils/http-status"

export class AttendanceController {
  static async recordAttendance(
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
      const classId = req.params.id
      const { attendeeId, status } = req.body as {
        attendeeId: string
        status: string
      }
      const rec = await AttendanceService.recordAttendance(
        classId,
        attendeeId,
        status as any
      )
      res.status(CREATED).json(rec)
    } catch (err) {
      next(err)
    }
  }

  static async getAttendanceForClass(
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
      const classId = req.params.id
      const { date, from, to } = req.query as any
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
