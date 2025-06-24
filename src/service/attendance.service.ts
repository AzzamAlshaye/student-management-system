// src/services/attendance.service.ts
import { AttendanceCollection } from "../models/attendance.model"

export class AttendanceService {
  static async recordAttendance(classId: string, attendeeId: string) {
    return AttendanceCollection.create({ classId, attendeeId })
  }

  static async getAttendanceForClass(classId: string) {
    return AttendanceCollection.find({ classId }).lean()
  }
}
