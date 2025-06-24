// src/controllers/participant.controller.ts
import { Request, Response, NextFunction } from "express"
import { ParticipantService } from "../service/participant.service"
import { CREATED } from "../utils/http-status"

export class ParticipantController {
  /** Add one or more students to a class (admin only) */
  static async addStudentsToClass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.id
      const { studentIds } = req.body // e.g. [ "student1", "student2", ... ]
      const added = await ParticipantService.addStudentsToClass(
        classId,
        studentIds
      )
      res.status(CREATED).json(added)
    } catch (err) {
      next(err)
    }
  }

  /** Add one or more teachers to a class (admin only) */
  static async addTeachersToClass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.id
      const { teacherIds } = req.body // e.g. [ "teacher1", "teacher2", ... ]
      const added = await ParticipantService.addTeachersToClass(
        classId,
        teacherIds
      )
      res.status(CREATED).json(added)
    } catch (err) {
      next(err)
    }
  }

  /** List all students in a class */
  static async getClassStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.id
      const students = await ParticipantService.getClassStudents(classId)
      res.json(students)
    } catch (err) {
      next(err)
    }
  }

  /** List all teachers in a class */
  static async getClassTeachers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.id
      const teachers = await ParticipantService.getClassTeachers(classId)
      res.json(teachers)
    } catch (err) {
      next(err)
    }
  }
}
