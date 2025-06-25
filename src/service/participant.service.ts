// src/services/participant.service.ts
import { ParticipantCollection } from "../models/participant.model"
import { UsersCollection, UserDocument } from "../models/user.model"
import { AppError } from "../utils/error"
import { BAD_REQUEST } from "../utils/http-status"

export class ParticipantService {
  /** Add one or more students to a class */
  static async addStudentsToClass(classId: string, studentIds: string[]) {
    // 1) Verify each studentId exists and role === "student"
    const students = await UsersCollection.find({
      id: { $in: studentIds },
      role: "student",
    }).lean()

    if (students.length !== studentIds.length) {
      const foundIds = new Set(students.map((u) => u.id))
      const missing = studentIds.filter((id) => !foundIds.has(id))
      throw new AppError(
        `Invalid student IDs or wrong role: ${missing.join(", ")}`,
        BAD_REQUEST
      )
    }

    // 2) Insert participant docs
    const docs = studentIds.map((userId) => ({ classId, userId }))
    return ParticipantCollection.insertMany(docs)
  }

  /** Add one or more teachers to a class */
  static async addTeachersToClass(classId: string, teacherIds: string[]) {
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

    const docs = teacherIds.map((userId) => ({ classId, userId }))
    return ParticipantCollection.insertMany(docs)
  }

  /** List all students in a given class */
  static async getClassStudents(classId: string): Promise<UserDocument[]> {
    const parts = await ParticipantCollection.find({ classId }).lean()
    const ids = parts.map((p) => p.userId)
    if (ids.length === 0) return []
    return UsersCollection.find({ id: { $in: ids }, role: "student" })
      .select("-password")
      .lean()
  }

  /** List all teachers in a given class */
  static async getClassTeachers(classId: string): Promise<UserDocument[]> {
    const parts = await ParticipantCollection.find({ classId }).lean()
    const ids = parts.map((p) => p.userId)
    if (ids.length === 0) return []
    return UsersCollection.find({ id: { $in: ids }, role: "teacher" })
      .select("-password")
      .lean()
  }

  /** List students who share at least one class with this teacher */
  static async getStudentsByTeacher(
    teacherId: string
  ): Promise<UserDocument[]> {
    const teacherParts = await ParticipantCollection.find({
      userId: teacherId,
    }).lean()
    const classIds = teacherParts.map((p) => p.classId)
    if (classIds.length === 0) return []

    const parts = await ParticipantCollection.find({
      classId: { $in: classIds },
    }).lean()
    const studentIds = Array.from(
      new Set(parts.map((p) => p.userId).filter((id) => id !== teacherId))
    )
    if (studentIds.length === 0) return []

    return UsersCollection.find({ id: { $in: studentIds }, role: "student" })
      .select("-password")
      .lean()
  }

  /** List teachers who share at least one class with this student */
  static async getTeachersByStudent(
    studentId: string
  ): Promise<UserDocument[]> {
    const studentParts = await ParticipantCollection.find({
      userId: studentId,
    }).lean()
    const classIds = studentParts.map((p) => p.classId)
    if (classIds.length === 0) return []

    const parts = await ParticipantCollection.find({
      classId: { $in: classIds },
    }).lean()
    const teacherIds = Array.from(
      new Set(parts.map((p) => p.userId).filter((id) => id !== studentId))
    )
    if (teacherIds.length === 0) return []

    return UsersCollection.find({ id: { $in: teacherIds }, role: "teacher" })
      .select("-password")
      .lean()
  }
}

export default ParticipantService
