// src/services/class.service.ts
import { ClassesCollection } from "../models/class.model"
import { ParticipantCollection } from "../models/participant.model"
import { ClassDocument } from "../models/class.model"

export class ClassService {
  static async createClass(data: Partial<ClassDocument>) {
    return ClassesCollection.create(data)
  }

  static async getClasses() {
    return ClassesCollection.find().lean()
  }

  static async getClassById(id: string) {
    return ClassesCollection.findOne({ id }).lean()
  }

  static async getClassStudents(classId: string) {
    return ParticipantCollection.find({ classId }).lean()
  }

  static async getClassTeachers(classId: string) {
    return ParticipantCollection.find({ classId }).lean()
  }
}
