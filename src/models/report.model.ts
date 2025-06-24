// src/models/report.model.ts
import { Schema, model, Document } from "mongoose"
import { generateId } from "../utils/generate-id"

export interface ReportDocument extends Document {
  id: string
  classId: string
  teacherId: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const reportSchema = new Schema<ReportDocument>(
  {
    id: { type: String, default: () => `rep_${generateId()}` },
    classId: { type: String, required: true },
    teacherId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false } }
)

export const ReportCollection = model<ReportDocument>("Report", reportSchema)
