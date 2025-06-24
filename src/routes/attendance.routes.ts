// src/routes/attendance.routes.ts
import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { AttendanceController } from "../controllers/attendance.controller"

const router = Router({ mergeParams: true })

// Record attendance for a class session (teacher/admin)
router.post(
  "/attendance",
  authenticate,
  authorize("teacher", "admin"),
  AttendanceController.recordAttendance
)

// Get attendance records for a class (RBAC inside controller)
router.get(
  "/attendance",
  authenticate,
  AttendanceController.getAttendanceForClass
)

export default router
