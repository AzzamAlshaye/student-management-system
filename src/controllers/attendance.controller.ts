// src/controllers/attendance.controller.ts
import { Request, Response, NextFunction } from "express"
import { AttendanceService } from "../service/attendance.service"
import { CREATED } from "../utils/http-status"

export class AttendanceController {
  static async recordAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const { attendeeId } = req.body // { attendeeId: string }
      const rec = await AttendanceService.recordAttendance(id, attendeeId)
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
    try {
      const { id } = req.params
      const recs = await AttendanceService.getAttendanceForClass(id)
      res.json(recs)
    } catch (err) {
      next(err)
    }
  }
}
