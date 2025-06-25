// src/services/attendance.service.ts
import { AttendanceCollection } from "../models/attendance.model"
import { ParticipantCollection } from "../models/participant.model"
import { ClassesCollection } from "../models/class.model"
import { UsersCollection } from "../models/user.model"
import { AppError } from "../utils/error"
import { BAD_REQUEST, NOT_FOUND } from "../utils/http-status"
import { AttendanceStatus } from "../models/attendance.model"

interface AttendanceFilters {
  date?: Date
  from?: Date
  to?: Date
}

export class AttendanceService {
  /** Record a single attendance with status */
  static async recordAttendance(
    classId: string,
    attendeeId: string,
    status: AttendanceStatus
  ) {
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

    // 3) User must be enrolled in this class
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

    // 4) Create attendance record
    return AttendanceCollection.create({ classId, attendeeId, status })
  }

  /**
   * Fetch attendance for a class, optionally filtering by:
   * - a single `date` (YYYY-MM-DD)
   * - a date range `from` … `to` (inclusive)
   */
  static async getAttendanceForClass(
    classId: string,
    filters: AttendanceFilters = {}
  ) {
    const query: any = { classId }

    if (filters.date) {
      // match that calendar day
      const start = new Date(filters.date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(end.getDate() + 1)
      query.attendedAt = { $gte: start, $lt: end }
    } else if (filters.from || filters.to) {
      const range: any = {}
      if (filters.from) range.$gte = filters.from
      if (filters.to) range.$lte = filters.to
      query.attendedAt = range
    }

    return AttendanceCollection.find(query).lean()
  }
}

export default AttendanceService
