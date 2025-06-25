import { Router } from "express"
import { param, body } from "express-validator"
import { authenticate, authorize } from "../middleware/auth.middleware"
import LeaveController from "../controllers/leave.controller"

const router = Router({ mergeParams: true })

router.post(
  "/leaves",
  authenticate,
  authorize("student", "admin"),
  param("id").isString().withMessage("Class ID is required"),
  body("studentId").isString().withMessage("studentId is required"),
  body("leaveAt").isISO8601().withMessage("leaveAt must be a valid date"),
  body("leaveType").isString().notEmpty().withMessage("leaveType is required"),
  LeaveController.applyLeave
)

router.get(
  "/leaves",
  authenticate,
  authorize("principal", "admin"),
  param("id").isString().withMessage("Class ID is required"),
  LeaveController.getLeavesForClass
)

router.put(
  "/leaves/:leaveId/accept",
  authenticate,
  authorize("principal", "admin"),
  param("id").isString(),
  param("leaveId").isString(),
  LeaveController.acceptLeave
)

router.put(
  "/leaves/:leaveId/reject",
  authenticate,
  authorize("principal", "admin"),
  param("id").isString(),
  param("leaveId").isString(),
  LeaveController.rejectLeave
)

export default router
