// src/services/user.service.ts
import { Types } from "mongoose"
import { UsersCollection, UserDocument, UserRole } from "../models/user.model"
import { LeaveCollection, LeaveDocument } from "../models/leave.model"
import { AppError } from "../utils/error"
import { BAD_REQUEST, NOT_FOUND } from "../utils/http-status"

export class UserService {
  /** Create a new user, ensuring email is unique */
  static async createUser(data: Partial<UserDocument>) {
    const { email, role } = data
    if (!email || !role) {
      throw new AppError("Email and role are required", BAD_REQUEST)
    }
    const existing = await UsersCollection.findOne({ email })
    if (existing) {
      const roleName = role.charAt(0).toUpperCase() + role.slice(1)
      throw new AppError(`${roleName} already exists`, BAD_REQUEST)
    }
    return UsersCollection.create(data)
  }

  /** Get everyone (admin only) */
  static async getAllUsers() {
    return UsersCollection.find().lean()
  }

  /** Get by role list (principal) */
  static async getUsersByRole(roles: UserRole[]) {
    return UsersCollection.find({ role: { $in: roles } }).lean()
  }

  /** Stub: real teacher→students lookup */
  static async getRelatedStudents(teacherId: string) {
    return UsersCollection.find({ role: "student" }).lean()
  }

  /** Stub: real student→teachers lookup */
  static async getRelatedTeachers(studentId: string) {
    return UsersCollection.find({ role: "teacher" }).lean()
  }

  /**
   * Fetch a user by either:
   * 1. MongoDB _id (if valid ObjectId), or
   * 2. your custom `id` field (`user_…`)
   */
  static async getUserById(id: string): Promise<UserDocument | null> {
    let user: UserDocument | null = null
    if (Types.ObjectId.isValid(id)) {
      user = await UsersCollection.findById(id).lean()
    }
    if (!user) {
      user = await UsersCollection.findOne({ id }).lean()
    }
    if (!user) {
      throw new AppError(`No user found with id="${id}"`, NOT_FOUND)
    }
    return user
  }

  /** Update by custom or ObjectId */
  static async updateUser(id: string, data: Partial<UserDocument>) {
    let filter: any
    if (Types.ObjectId.isValid(id)) filter = { _id: id }
    else filter = { id }
    const updated = await UsersCollection.findOneAndUpdate(filter, data, {
      new: true,
    }).lean()
    if (!updated) {
      throw new AppError(`No user to update with id="${id}"`, NOT_FOUND)
    }
    return updated
  }

  /** Delete by custom or ObjectId */
  static async deleteUser(id: string) {
    let filter: any
    if (Types.ObjectId.isValid(id)) filter = { _id: id }
    else filter = { id }
    const deleted = await UsersCollection.findOneAndDelete(filter).lean()
    if (!deleted) {
      throw new AppError(`No user to delete with id="${id}"`, NOT_FOUND)
    }
    return deleted
  }

  // ─── Leaves ───────────────────────────────────────────────────

  static async getUserLeaves(userId: string) {
    return LeaveCollection.find({ user: userId }).lean()
  }

  static async acceptLeave(userId: string, leaveId: string) {
    const updated = await LeaveCollection.findOneAndUpdate(
      { id: leaveId, user: userId },
      { status: "accepted" },
      { new: true }
    ).lean()
    if (!updated) {
      throw new AppError(
        `No leave found with id="${leaveId}" for user="${userId}"`,
        NOT_FOUND
      )
    }
    return updated
  }

  static async rejectLeave(userId: string, leaveId: string) {
    const updated = await LeaveCollection.findOneAndUpdate(
      { id: leaveId, user: userId },
      { status: "rejected" },
      { new: true }
    ).lean()
    if (!updated) {
      throw new AppError(
        `No leave found with id="${leaveId}" for user="${userId}"`,
        NOT_FOUND
      )
    }
    return updated
  }
}

export default UserService
