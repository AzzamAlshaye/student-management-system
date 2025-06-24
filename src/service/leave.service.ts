// src/services/leave.service.ts
import { LeaveCollection, LeaveDocument } from "../models/leave.model"

export class LeaveService {
  static async applyLeave(
    classId: string,
    studentId: string,
    leaveAt: Date,
    leaveType: LeaveDocument["leaveType"]
  ) {
    return LeaveCollection.create({ classId, studentId, leaveAt, leaveType })
  }

  static async getLeavesForClass(classId: string) {
    return LeaveCollection.find({ classId }).lean()
  }

  static async acceptLeave(
    classId: string,
    leaveId: string,
    approverId: string
  ) {
    return LeaveCollection.findOneAndUpdate(
      { classId, id: leaveId },
      { acceptedBy: approverId, acceptedAt: new Date() },
      { new: true }
    ).lean()
  }

  static async rejectLeave(
    classId: string,
    leaveId: string,
    approverId: string
  ) {
    return LeaveCollection.findOneAndUpdate(
      { classId, id: leaveId },
      { rejectedBy: approverId, rejectedAt: new Date() },
      { new: true }
    ).lean()
  }
}
