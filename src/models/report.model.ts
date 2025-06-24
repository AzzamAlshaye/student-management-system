// src/models/report.model.ts
import { Schema, model, Document, Types } from "mongoose"

export interface ReportDocument extends Document {
  id: string
  reporter: Types.ObjectId
  targetUser?: Types.ObjectId
  targetClass?: Types.ObjectId
  content: string
  createdAt: Date
}

const reportSchema = new Schema<ReportDocument>(
  {
    id: { type: String, default: () => `report_${Date.now()}` },
    reporter: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    targetUser: { type: Schema.Types.ObjectId, ref: "Users" },
    targetClass: { type: Schema.Types.ObjectId, ref: "Classes" },
    content: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
)

export const ReportsCollection = model<ReportDocument>("Reports", reportSchema)
