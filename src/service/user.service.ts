//src/services/user.service.ts
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
    const existing = await UsersCollection.findOne({ email }).select(
      "+password"
    )
    if (existing) {
      const roleName = role.charAt(0).toUpperCase() + role.slice(1)
      throw new AppError(`${roleName} already exists`, BAD_REQUEST)
    }
    return UsersCollection.create(data)
  }

  /** Get everyone (admin only) */
  static async getAllUsers() {
    return UsersCollection.find().select("-password").lean()
  }

  /** Get by role list (principal) */
  static async getUsersByRole(roles: UserRole[]) {
    return UsersCollection.find({ role: { $in: roles } })
      .select("-password")
      .lean()
  }

  /** Stub: real teacher→students lookup */
  static async getRelatedStudents(teacherId: string) {
    return UsersCollection.find({ role: "student" }).select("-password").lean()
  }

  /** Stub: real student→teachers lookup */
  static async getRelatedTeachers(studentId: string) {
    return UsersCollection.find({ role: "teacher" }).select("-password").lean()
  }

  static async getUserById(id: string): Promise<UserDocument | null> {
    let user: UserDocument | null = null
    if (Types.ObjectId.isValid(id)) {
      user = await UsersCollection.findById(id).select("-password").lean()
    }
    if (!user) {
      user = await UsersCollection.findOne({ id }).select("-password").lean()
    }
    if (!user) {
      throw new AppError(`No user found with id="${id}"`, NOT_FOUND)
    }
    return user
  }

  /** Update by custom or ObjectId */
  static async updateUser(id: string, data: Partial<UserDocument>) {
    const filter = Types.ObjectId.isValid(id) ? { _id: id } : { id }
    const updated = await UsersCollection.findOneAndUpdate(filter, data, {
      new: true,
    })
      .select("-password")
      .lean()

    if (!updated) {
      throw new AppError(`No user to update with id="${id}"`, NOT_FOUND)
    }
    return updated
  }

  /** Delete by custom or ObjectId */
  static async deleteUser(id: string) {
    const filter = Types.ObjectId.isValid(id) ? { _id: id } : { id }
    const deleted = await UsersCollection.findOneAndDelete(filter)
      .select("-password")
      .lean()

    if (!deleted) {
      throw new AppError(`No user to delete with id="${id}"`, NOT_FOUND)
    }
    return deleted
  }

  // ─── Leaves ───────────────────────────────────

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
