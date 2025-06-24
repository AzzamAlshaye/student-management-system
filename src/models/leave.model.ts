// src/models/leave.model.ts
import { Schema, model, Document } from "mongoose"
import { generateId } from "../utils/generate-id"

export type LeaveType = "sick" | "vacation" | "personal" | "other"
export type LeaveStatus = "pending" | "accepted" | "rejected"

export interface LeaveDocument extends Document {
  id: string
  classId: string
  user: string // custom user.id
  leaveAt: Date
  leaveType: LeaveType
  status: LeaveStatus
  createdAt: Date
  updatedAt: Date
}

const leaveSchema = new Schema<LeaveDocument>(
  {
    id: {
      type: String,
      default: () => `leave_${generateId()}`,
      unique: true,
    },
    classId: { type: String, required: true },
    user: { type: String, required: true },
    leaveAt: { type: Date, required: true },
    leaveType: {
      type: String,
      required: true,
      enum: ["sick", "vacation", "personal", "other"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
)

export const LeaveCollection = model<LeaveDocument>("Leave", leaveSchema)
