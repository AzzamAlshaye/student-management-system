// src/models/class.model.ts
import { Schema, model, Document } from "mongoose"
import { generateId } from "../utils/generate-id"

export interface ClassDocument extends Document {
  id: string
  name: string
  description?: string
  location?: string
  capacity?: number
  dateStartAt: Date
  dateEndAt: Date
  timeStartAt: string
  timeEndAt: string
  createdAt: Date
  updatedAt: Date
}

const classSchema = new Schema<ClassDocument>(
  {
    id: { type: String, default: () => `class_${generateId()}` },
    name: { type: String, required: true },
    description: String,
    location: String,
    capacity: Number,
    dateStartAt: { type: Date, required: true },
    dateEndAt: { type: Date, required: true },
    timeStartAt: { type: String, required: true },
    timeEndAt: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => ({ ...ret, _id: undefined }),
    },
  }
)

export const ClassesCollection = model<ClassDocument>("Classes", classSchema)
