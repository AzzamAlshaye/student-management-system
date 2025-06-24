// src/models/leave.model.ts
import { Schema, model, Document } from "mongoose"
import { generateId } from "../utils/generate-id"

export type LeaveType = "excuse" | "leave"

export interface LeaveDocument extends Document {
  id: string
  classId: string
  studentId: string
  leaveAt: Date
  leaveType: LeaveType
  acceptedBy?: string
  acceptedAt?: Date
  rejectedBy?: string
  rejectedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const leaveSchema = new Schema<LeaveDocument>(
  {
    id: { type: String, default: () => `lv_${generateId()}` },
    classId: { type: String, required: true },
    studentId: { type: String, required: true },
    leaveAt: { type: Date, required: true },
    leaveType: { type: String, enum: ["excuse", "leave"], required: true },
    acceptedBy: String,
    acceptedAt: Date,
    rejectedBy: String,
    rejectedAt: Date,
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false } }
)

export const LeaveCollection = model<LeaveDocument>("Leave", leaveSchema)
