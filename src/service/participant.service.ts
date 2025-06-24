// src/services/participant.service.ts
import { ParticipantCollection } from "../models/participant.model"
import { UsersCollection, UserDocument } from "../models/user.model"
import { AppError } from "../utils/error"
import { BAD_REQUEST } from "../utils/http-status"

export class ParticipantService {
  /** Add one or more students to a class */
  static async addStudentsToClass(classId: string, studentIds: string[]) {
    // 1) Verify each studentId exists and has role "student"
    const students = await UsersCollection.find({
      id: { $in: studentIds },
      role: "student",
    }).lean()

    if (students.length !== studentIds.length) {
      // find which IDs are invalid
      const foundIds = new Set(students.map((u) => u.id))
      const missing = studentIds.filter((id) => !foundIds.has(id))
      throw new AppError(
        `Invalid student IDs or wrong role: ${missing.join(", ")}`,
        BAD_REQUEST
      )
    }

    // 2) Safe to insert
    const docs = studentIds.map((userId) => ({ classId, userId }))
    return ParticipantCollection.insertMany(docs)
  }

  /** Add one or more teachers to a class */
  static async addTeachersToClass(classId: string, teacherIds: string[]) {
    // 1) Verify each teacherId exists and has role "teacher"
    const teachers = await UsersCollection.find({
      id: { $in: teacherIds },
      role: "teacher",
    }).lean()

    if (teachers.length !== teacherIds.length) {
      const foundIds = new Set(teachers.map((u) => u.id))
      const missing = teacherIds.filter((id) => !foundIds.has(id))
      throw new AppError(
        `Invalid teacher IDs or wrong role: ${missing.join(", ")}`,
        BAD_REQUEST
      )
    }

    // 2) Safe to insert
    const docs = teacherIds.map((userId) => ({ classId, userId }))
    return ParticipantCollection.insertMany(docs)
  }

  /** List all students in a class */
  static async getClassStudents(classId: string): Promise<UserDocument[]> {
    const parts = await ParticipantCollection.find({ classId }).lean()
    const ids = parts.map((p) => p.userId)
    return UsersCollection.find({
      id: { $in: ids },
      role: "student",
    }).lean()
  }

  /** List all teachers in a class */
  static async getClassTeachers(classId: string): Promise<UserDocument[]> {
    const parts = await ParticipantCollection.find({ classId }).lean()
    const ids = parts.map((p) => p.userId)
    return UsersCollection.find({
      id: { $in: ids },
      role: "teacher",
    }).lean()
  }
}

export default ParticipantService
