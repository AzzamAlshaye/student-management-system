// src/routes/attendance.routes.ts
import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware"
import AttendanceController from "../controllers/attendance.controller"

const router = Router({ mergeParams: true })

// Record attendance (teacher, admin)
router.post(
  "/attendance",
  authenticate,
  authorize("teacher", "admin"),
  AttendanceController.recordAttendance
)

// Get attendance (teacher, principal, admin)
router.get(
  "/attendance",
  authenticate,
  authorize("teacher", "principal", "admin"),
  AttendanceController.getAttendanceForClass
)

export default router
