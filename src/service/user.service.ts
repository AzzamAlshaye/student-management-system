// src/services/user.service.ts
import { FilterQuery } from "mongoose"
import { UsersCollection, UserDocument, UserRole } from "../models/user.model"
import { LeaveCollection, LeaveDocument } from "../models/leave.model"

export class UserService {
  static async createUser(data: Partial<UserDocument>) {
    return UsersCollection.create(data)
  }

  static async getAllUsers() {
    return UsersCollection.find().lean()
  }

  static async getUsersByRole(roles: UserRole[]) {
    return UsersCollection.find({ role: { $in: roles } }).lean()
  }

  static async getRelatedStudents(teacherId: string) {
    // TODO: implement real relationship lookup (e.g. via Class assignments)
    return UsersCollection.find({
      role: "student" /* filter by teacherId */,
    }).lean()
  }

  static async getRelatedTeachers(studentId: string) {
    // TODO: implement real relationship lookup
    return UsersCollection.find({
      role: "teacher" /* filter by studentId */,
    }).lean()
  }

  static async getUserById(id: string) {
    return UsersCollection.findOne({ id }).lean()
  }

  static async updateUser(id: string, data: Partial<UserDocument>) {
    return UsersCollection.findOneAndUpdate({ id }, data, { new: true }).lean()
  }

  static async deleteUser(id: string) {
    return UsersCollection.findOneAndDelete({ id }).lean()
  }

  // --- Leaves ---
  static async getUserLeaves(userId: string) {
    return LeaveCollection.find({ user: userId }).lean()
  }

  static async acceptLeave(userId: string, leaveId: string) {
    return LeaveCollection.findOneAndUpdate(
      { id: leaveId, user: userId },
      { status: "accepted" },
      { new: true }
    ).lean()
  }

  static async rejectLeave(userId: string, leaveId: string) {
    return LeaveCollection.findOneAndUpdate(
      { id: leaveId, user: userId },
      { status: "rejected" },
      { new: true }
    ).lean()
  }
}

export default UserService
