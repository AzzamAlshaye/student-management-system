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

// Get leaves for a class (principal, admin)
router.get(
  "/leaves",
  authenticate,
  authorize("principal", "admin"),
  LeaveController.getLeavesForClass
)

// Accept a leave request (principal, admin)
router.put(
  "/leaves/:leaveId/accept",
  authenticate,
  authorize("principal", "admin"),
  LeaveController.acceptLeave
)

// Reject a leave request (principal, admin)
router.put(
  "/leaves/:leaveId/reject",
  authenticate,
  authorize("principal", "admin"),
  LeaveController.rejectLeave
)

export default router
