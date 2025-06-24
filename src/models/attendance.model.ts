// src/models/attendance.model.ts
import { Schema, model, Document } from "mongoose"
import { generateId } from "../utils/generate-id"

export interface AttendanceDocument extends Document {
  id: string
  classId: string
  attendeeId: string
  attendedAt: Date
}

const attendanceSchema = new Schema<AttendanceDocument>(
  {
    id: { type: String, default: () => `att_${generateId()}` },
    classId: { type: String, required: true },
    attendeeId: { type: String, required: true },
    attendedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false } }
)

export const AttendanceCollection = model<AttendanceDocument>(
  "Attendance",
  attendanceSchema
)
