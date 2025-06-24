// src/services/user.service.ts
import { UsersCollection, UserDocument } from "../models/user.model"

export interface CreateUserDTO {
  email: string
  password: string
  role?: UserDocument["role"]
}

export interface UpdateUserDTO {
  email?: string
  password?: string
  role?: UserDocument["role"]
}

export async function createUser(data: CreateUserDTO): Promise<UserDocument> {
  const user = await UsersCollection.create(data)
  return user
}

export async function getAllUsers(): Promise<UserDocument[]> {
  return UsersCollection.find().exec()
}

export async function getUserById(id: string): Promise<UserDocument | null> {
  return UsersCollection.findOne({ id }).exec()
}

export async function updateUser(
  id: string,
  data: UpdateUserDTO
): Promise<UserDocument | null> {
  if (data.password) {
    // let schema pre-save hook hash it
  }
  return UsersCollection.findOneAndUpdate({ id }, data, {
    new: true,
    runValidators: true,
  }).exec()
}

export async function deleteUser(id: string): Promise<UserDocument | null> {
  return UsersCollection.findOneAndDelete({ id }).exec()
}
