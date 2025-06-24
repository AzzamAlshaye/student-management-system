// src/services/admin.service.ts
import { UsersCollection } from "../models/user.model"
import { ClassesCollection } from "../models/class.model"
import { LeavesCollection } from "../models/leave.model"
import { ReportsCollection } from "../models/report.model"

// Create a new student
export async function addStudent(data: {
  email: string
  password: string /* other fields */
}) {
  return UsersCollection.create({ ...data, role: "student" })
}

// Create a new teacher
export async function addTeacher(data: {
  email: string
  password: string /* other fields */
}) {
  return UsersCollection.create({ ...data, role: "teacher" })
}

// Create a new class with a principal
export async function createClass(data: { name: string; principalId: string }) {
  return ClassesCollection.create({
    name: data.name,
    principal: data.principalId,
  })
}

// Assign multiple students to a class
export async function assignStudentsToClass(
  classId: string,
  studentIds: string[]
) {
  return ClassesCollection.findByIdAndUpdate(
    classId,
    { $addToSet: { students: { $each: studentIds } } },
    { new: true }
  )
}

// Assign multiple teachers to a class
export async function assignTeachersToClass(
  classId: string,
  teacherIds: string[]
) {
  return ClassesCollection.findByIdAndUpdate(
    classId,
    { $addToSet: { teachers: { $each: teacherIds } } },
    { new: true }
  )
}

// Assign or change the principal for a class
export async function assignPrincipalToClass(
  classId: string,
  principalId: string
) {
  return ClassesCollection.findByIdAndUpdate(
    classId,
    { principal: principalId },
    { new: true }
  )
}

// Approve or reject a leave/excuse by ID
export async function updateLeaveStatus(
  leaveId: string,
  status: "approved" | "rejected"
) {
  return LeavesCollection.findByIdAndUpdate(leaveId, { status }, { new: true })
}

// Retrieve all reports with populated relations
export async function getAllReports() {
  return ReportsCollection.find()
    .populate("reporter targetUser targetClass")
    .exec()
}
