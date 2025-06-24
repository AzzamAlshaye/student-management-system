// src/models/participant.model.ts
import { Schema, model, Document } from "mongoose"
import { generateId } from "../utils/generate-id"

export interface ParticipantDocument extends Document {
  id: string
  classId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

const participantSchema = new Schema<ParticipantDocument>(
  {
    id: {
      type: String,
      default: () => `part_${generateId()}`,
      unique: true,
    },
    classId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
)

export const ParticipantCollection = model<ParticipantDocument>(
  "Participant",
  participantSchema
)
