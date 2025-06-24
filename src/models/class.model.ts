// src/models/class.model.ts
import { Schema, model, Document, Types } from "mongoose"

export interface ClassDocument extends Document {
  id: string
  name: string
  students: Types.ObjectId[] // refs to Users
  teachers: Types.ObjectId[] // refs to Users
  principal: Types.ObjectId // ref to Users
}

const classSchema = new Schema<ClassDocument>(
  {
    id: { type: String, default: () => `class_${Date.now()}` },
    name: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    teachers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    principal: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  },
  { timestamps: true, versionKey: false }
)

export const ClassesCollection = model<ClassDocument>("Classes", classSchema)
