import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import ParticipantService from "../service/participant.service"
import { CREATED } from "../utils/http-status"

export class ParticipantController {
  static async addStudentsToClass(
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

  static async addTeachersToClass(
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

  static async getClassStudents(
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
      const students = await ParticipantService.getClassStudents(classId)
      res.json({ students })
    } catch (err) {
      next(err)
    }
  }

  static async getClassTeachers(
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
      const teachers = await ParticipantService.getClassTeachers(classId)
      res.json({ teachers })
    } catch (err) {
      next(err)
    }
  }
}

export default ParticipantController
