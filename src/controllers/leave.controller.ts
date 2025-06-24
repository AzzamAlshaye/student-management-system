// src/controllers/leave.controller.ts
import { Request, Response, NextFunction } from "express"
import LeaveService from "../service/leave.service"
import { CREATED } from "../utils/http-status"

export class LeaveController {
  static async applyLeave(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.id
      const { studentId, leaveAt, leaveType } = req.body
      const leave = await LeaveService.applyLeave(
        classId,
        studentId,
        new Date(leaveAt),
        leaveType
      )
      res.status(CREATED).json(leave)
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
      const leaves = await LeaveService.getLeavesForClass(req.params.id)
      res.json(leaves)
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
      const updated = await LeaveService.acceptLeave(
        req.params.id,
        req.params.leaveId,
        req.user!.id
      )
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
      const updated = await LeaveService.rejectLeave(
        req.params.id,
        req.params.leaveId,
        req.user!.id
      )
      res.json(updated)
    } catch (err) {
      next(err)
    }
  }
}

export default LeaveController
