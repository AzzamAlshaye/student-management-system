// src/routes/report.routes.ts
import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { ReportController } from "../controllers/report.controller"

const router = Router({ mergeParams: true })

// Teacher creates a report for a class
router.post(
  "/reports",
  authenticate,
  authorize("teacher", "admin"),
  ReportController.createReport
)

// Admin, Principal, or Teacher views reports for a class
router.get(
  "/reports",
  authenticate,
  authorize("admin", "principal", "teacher"),
  ReportController.getReportsForClass
)

export default router
