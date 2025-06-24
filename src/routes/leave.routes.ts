// src/routes/leave.routes.ts
import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware"
import LeaveController from "../controllers/leave.controller"

const router = Router({ mergeParams: true })

// Apply for leave (student only)
router.post(
  "/leaves",
  authenticate,
  authorize("student", "admin"),
  LeaveController.applyLeave
)

// Get leaves for a class
router.get("/leaves", authenticate, LeaveController.getLeavesForClass)

// Accept/reject (admin/principal/teacher)
router.put(
  "/leaves/:leaveId/accept",
  authenticate,
  authorize("admin", "principal", "teacher"),
  LeaveController.acceptLeave
)
router.put(
  "/leaves/:leaveId/reject",
  authenticate,
  authorize("admin", "principal", "teacher"),
  LeaveController.rejectLeave
)

export default router
