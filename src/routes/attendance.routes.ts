// src/routes/attendance.routes.ts
import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware"
import AttendanceController from "../controllers/attendance.controller"

const router = Router({ mergeParams: true })

// Record attendance with status (teacher/admin)
router.post(
  "/attendance",
  authenticate,
  authorize("teacher", "admin"),
  AttendanceController.recordAttendance
)

// Get attendance, filterable by date or date range
router.get(
  "/attendance",
  authenticate,
  AttendanceController.getAttendanceForClass
)

export default router
