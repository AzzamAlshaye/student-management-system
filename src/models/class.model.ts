// src/models/class.model.ts
import { Schema, model, Document } from "mongoose"
import { generateId } from "../utils/generate-id"

export interface ClassDocument extends Document {
  id: string
  name: string
  description?: string
  dateStartAt?: Date
  dateEndAt?: Date
  timeStartAt?: string
  timeEndAt?: string
  createdAt: Date
  updatedAt: Date
}

const classSchema = new Schema<ClassDocument>(
  {
    id: {
      type: String,
      default: () => `class_${generateId()}`,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,

    // no longer required:
    dateStartAt: { type: Date, required: false },
    dateEndAt: { type: Date, required: false },
    timeStartAt: { type: String, required: false },
    timeEndAt: { type: String, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
)

export const ClassesCollection = model<ClassDocument>("Class", classSchema)
