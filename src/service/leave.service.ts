// src/services/leave.service.ts
import { LeaveCollection } from "../models/leave.model"
import { ClassesCollection } from "../models/class.model"
import { UsersCollection } from "../models/user.model"
import { ParticipantCollection } from "../models/participant.model"
import { AppError } from "../utils/error"
import { BAD_REQUEST, NOT_FOUND } from "../utils/http-status"
import { LeaveType } from "../models/leave.model"

export class LeaveService {
  static async applyLeave(
    classId: string,
    userId: string,
    leaveAt: Date,
    leaveType: LeaveType
  ) {
    // 1) Class must exist
    const cls = await ClassesCollection.findOne({ id: classId })
    if (!cls) {
      throw new AppError(`No class found with id="${classId}"`, NOT_FOUND)
    }

    // 2) User must exist
    const user = await UsersCollection.findOne({ id: userId })
    if (!user) {
      throw new AppError(`No user found with id="${userId}"`, BAD_REQUEST)
    }

    // 3) User must be enrolled in this class
    const part = await ParticipantCollection.findOne({ classId, userId })
    if (!part) {
      throw new AppError(
        `User id="${userId}" is not enrolled in class id="${classId}"`,
        BAD_REQUEST
      )
    }

    // 4) leaveType is already enforced by Mongoose enum,
    //    but you could double-check here if you like

    // 5) Create the leave record (includes required `user` field)
    const leave = await LeaveCollection.create({
      classId,
      user: userId,
      leaveAt,
      leaveType,
    })

    return leave
  }

  static async getLeavesForClass(classId: string) {
    // optionally: check class exists as above
    return LeaveCollection.find({ classId }).lean()
  }

  static async acceptLeave(
    classId: string,
    leaveId: string,
    approverId: string
  ) {
    const updated = await LeaveCollection.findOneAndUpdate(
      { id: leaveId, classId },
      { status: "accepted" },
      { new: true }
    ).lean()

    if (!updated) {
      throw new AppError(
        `No leave found with id="${leaveId}" for class="${classId}"`,
        NOT_FOUND
      )
    }
    return updated
  }

  static async rejectLeave(
    classId: string,
    leaveId: string,
    approverId: string
  ) {
    const updated = await LeaveCollection.findOneAndUpdate(
      { id: leaveId, classId },
      { status: "rejected" },
      { new: true }
    ).lean()

    if (!updated) {
      throw new AppError(
        `No leave found with id="${leaveId}" for class="${classId}"`,
        NOT_FOUND
      )
    }
    return updated
  }
}

export default LeaveService
