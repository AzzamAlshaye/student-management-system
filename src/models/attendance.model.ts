// src/models/attendance.model.ts
import { Schema, model, Document } from "mongoose"
import { generateId } from "../utils/generate-id"

export type AttendanceStatus = "present" | "absent" | "late" | "excused"

export interface AttendanceDocument extends Document {
  id: string
  classId: string
  attendeeId: string
  status: AttendanceStatus
  attendedAt: Date
}

const attendanceSchema = new Schema<AttendanceDocument>(
  {
    id: {
      type: String,
      default: () => `att_${generateId()}`,
      unique: true,
    },
    classId: { type: String, required: true },
    attendeeId: { type: String, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
    },
    attendedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
)

export const AttendanceCollection = model<AttendanceDocument>(
  "Attendance",
  attendanceSchema
)
