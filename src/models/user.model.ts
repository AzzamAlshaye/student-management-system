import { Schema, model, Document } from "mongoose"
import bcrypt from "bcryptjs"
import { generateId } from "../utils/generate-id"

// 1️⃣ Extend the role enum to include student, teacher, principal, admin
export type UserRole = "student" | "teacher" | "principal" | "admin"

export interface UserDocument extends Document {
  id: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new Schema<UserDocument>(
  {
    id: {
      type: String,
      default: () => `user_${generateId()}`,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "principal", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => ({
        id: ret.id,
        email: ret.email,
        role: ret.role,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      }),
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => ({
        id: ret.id,
        email: ret.email,
        role: ret.role,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      }),
    },
  }
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare candidate vs. stored hash
userSchema.methods.comparePassword = function (
  this: UserDocument,
  candidate: string
) {
  return bcrypt.compare(candidate, this.password)
}

export const UsersCollection = model<UserDocument>("Users", userSchema)
