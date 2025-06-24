// src/services/participant.service.ts
import { ParticipantCollection } from "../models/participant.model"
import { UsersCollection, UserDocument } from "../models/user.model"

export class ParticipantService {
  /** Add one or more students to a class */
  static async addStudentsToClass(classId: string, studentIds: string[]) {
    const docs = studentIds.map((userId) => ({ classId, userId }))
    return ParticipantCollection.insertMany(docs)
  }

  /** Add one or more teachers to a class */
  static async addTeachersToClass(classId: string, teacherIds: string[]) {
    const docs = teacherIds.map((userId) => ({ classId, userId }))
    return ParticipantCollection.insertMany(docs)
  }

  /** List all students in a class */
  static async getClassStudents(classId: string): Promise<UserDocument[]> {
    // 1) Find all participant entries for this class
    const parts = await ParticipantCollection.find({ classId }).lean()
    const ids = parts.map((p) => p.userId)
    // 2) Return only those users whose role is student
    return UsersCollection.find({
      _id: { $in: ids },
      role: "student",
    }).lean()
  }

  /** List all teachers in a class */
  static async getClassTeachers(classId: string): Promise<UserDocument[]> {
    const parts = await ParticipantCollection.find({ classId }).lean()
    const ids = parts.map((p) => p.userId)
    return UsersCollection.find({
      _id: { $in: ids },
      role: "teacher",
    }).lean()
  }
}
