// src/models/leave.model.ts
import { Schema, model, Document, Types } from "mongoose"

export type LeaveStatus = "pending" | "approved" | "rejected"
export type LeaveType = "leave" | "excuse"

export interface LeaveDocument extends Document {
  id: string
  user: Types.ObjectId
  type: LeaveType
  reason: string
  status: LeaveStatus
  from: Date
  to: Date
  createdAt: Date
}

const leaveSchema = new Schema<LeaveDocument>(
  {
    id: { type: String, default: () => `leave_${Date.now()}` },
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    type: { type: String, enum: ["leave", "excuse"], required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
)

export const LeavesCollection = model<LeaveDocument>("Leaves", leaveSchema)
