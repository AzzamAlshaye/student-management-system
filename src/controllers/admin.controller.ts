// // src/controllers/admin.controller.ts
// import { Request, Response, NextFunction } from "express"
// import * as adminService from "../service/admin.service"

// // Students & Teachers
// export const addStudent = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const student = await adminService.addStudent(req.body)
//     res.status(201).json(student)
//   } catch (err) {
//     next(err)
//   }
// }

// export const addTeacher = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const teacher = await adminService.addTeacher(req.body)
//     res.status(201).json(teacher)
//   } catch (err) {
//     next(err)
//   }
// }

// // Classes
// export const createClass = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const newClass = await adminService.createClass(req.body)
//     res.status(201).json(newClass)
//   } catch (err) {
//     next(err)
//   }
// }

// export const assignStudentsToClass = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const updated = await adminService.assignStudentsToClass(
//       req.params.id,
//       req.body.studentIds
//     )
//     res.json(updated)
//   } catch (err) {
//     next(err)
//   }
// }

// export const assignTeachersToClass = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const updated = await adminService.assignTeachersToClass(
//       req.params.id,
//       req.body.teacherIds
//     )
//     res.json(updated)
//   } catch (err) {
//     next(err)
//   }
// }

// export const assignPrincipalToClass = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const updated = await adminService.assignPrincipalToClass(
//       req.params.id,
//       req.body.principalId
//     )
//     res.json(updated)
//   } catch (err) {
//     next(err)
//   }
// }

// // Leaves / Excuses
// export const acceptLeave = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const updated = await adminService.updateLeaveStatus(
//       req.params.id,
//       "approved"
//     )
//     res.json(updated)
//   } catch (err) {
//     next(err)
//   }
// }

// export const rejectLeave = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const updated = await adminService.updateLeaveStatus(
//       req.params.id,
//       "rejected"
//     )
//     res.json(updated)
//   } catch (err) {
//     next(err)
//   }
// }

// // Reports
// export const viewReports = async (
//   _: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const reports = await adminService.getAllReports()
//     res.json(reports)
//   } catch (err) {
//     next(err)
//   }
// }
