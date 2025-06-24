// src/controllers/participant.controller.ts
import { Request, Response, NextFunction } from "express"
import ParticipantService from "../service/participant.service"
import { CREATED } from "../utils/http-status"

export class ParticipantController {
  /** POST /classes/:id/students */
  static async addStudentsToClass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.id
      const studentIds = req.body.studentIds as string[]
      const participants = await ParticipantService.addStudentsToClass(
        classId,
        studentIds
      )
      res
        .status(CREATED)
        .json({ message: "Students added to class", participants })
    } catch (err) {
      next(err)
    }
  }

  /** POST /classes/:id/teachers */
  static async addTeachersToClass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.id
      const teacherIds = req.body.teacherIds as string[]
      const participants = await ParticipantService.addTeachersToClass(
        classId,
        teacherIds
      )
      res
        .status(CREATED)
        .json({ message: "Teachers added to class", participants })
    } catch (err) {
      next(err)
    }
  }

  /** GET /classes/:id/students */
  static async getClassStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.id
      const students = await ParticipantService.getClassStudents(classId)
      res.json({ students })
    } catch (err) {
      next(err)
    }
  }

  /** GET /classes/:id/teachers */
  static async getClassTeachers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.id
      const teachers = await ParticipantService.getClassTeachers(classId)
      res.json({ teachers })
    } catch (err) {
      next(err)
    }
  }
}

export default ParticipantController
