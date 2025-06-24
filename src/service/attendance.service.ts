// src/services/attendance.service.ts
import { AttendanceCollection } from "../models/attendance.model"
import { ParticipantCollection } from "../models/participant.model"
import { ClassesCollection } from "../models/class.model"
import { UsersCollection } from "../models/user.model"
import { AppError } from "../utils/error"
import { BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

export class AttendanceService {
  static async recordAttendance(classId: string, attendeeId: string) {
    // 1) Class must exist
    const cls = await ClassesCollection.findOne({ id: classId })
    if (!cls) {
      throw new AppError(`No class found with id="${classId}"`, NOT_FOUND)
    }

    // 2) User must exist
    const user = await UsersCollection.findOne({ id: attendeeId })
    if (!user) {
      throw new AppError(`No user found with id="${attendeeId}"`, BAD_REQUEST)
    }

    // 3) User must be a participant in this class
    const participation = await ParticipantCollection.findOne({
      classId,
      userId: attendeeId,
    })
    if (!participation) {
      throw new AppError(
        `User id="${attendeeId}" is not enrolled in class id="${classId}"`,
        BAD_REQUEST
      )
    }

    // 4) All validations passed → record attendance
    return AttendanceCollection.create({ classId, attendeeId })
  }

  static async getAttendanceForClass(classId: string) {
    return AttendanceCollection.find({ classId }).lean()
  }
}

export default AttendanceService
