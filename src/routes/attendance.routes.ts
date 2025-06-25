import { Router } from "express"
import { param, body, query } from "express-validator"
import { authenticate, authorize } from "../middleware/auth.middleware"
import AttendanceController from "../controllers/attendance.controller"

const router = Router({ mergeParams: true })

router.post(
  "/attendance",
  authenticate,
  authorize("teacher", "admin"),
  param("id").isString().withMessage("Class ID is required"),
  body("attendeeId").isString().withMessage("attendeeId is required"),
  body("status").isString().notEmpty().withMessage("status is required"),
  AttendanceController.recordAttendance
)

router.get(
  "/attendance",
  authenticate,
  authorize("teacher", "principal", "admin"),
  param("id").isString().withMessage("Class ID is required"),
  query("date").optional().isISO8601().withMessage("date must be YYYY-MM-DD"),
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
  AttendanceController.getAttendanceForClass
)

export default router
