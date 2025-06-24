// src/controllers/leave.controller.ts
import { Request, Response, NextFunction } from "express"
import { LeaveService } from "../service/leave.service"
import { CREATED } from "../utils/http-status"

export class LeaveController {
  static async applyLeave(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params // classId
      const { studentId, leaveAt, leaveType } = req.body
      const lv = await LeaveService.applyLeave(
        id,
        studentId,
        new Date(leaveAt),
        leaveType
      )
      res.status(CREATED).json(lv)
    } catch (err) {
      next(err)
    }
  }

  static async getLeavesForClass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const list = await LeaveService.getLeavesForClass(id)
      res.json(list)
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
      const { id, leaveId } = req.params
      const approver = req.user!.id
      const updated = await LeaveService.acceptLeave(id, leaveId, approver)
      if (!updated) {
        res.sendStatus(404)
        return
      }
      res.json(updated)
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
      const { id, leaveId } = req.params
      const approver = req.user!.id
      const updated = await LeaveService.rejectLeave(id, leaveId, approver)
      if (!updated) {
        res.sendStatus(404)
        return
      }
      res.json(updated)
    } catch (err) {
      next(err)
    }
  }
}
