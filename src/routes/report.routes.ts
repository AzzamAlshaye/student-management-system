import { Router } from "express"
import { body, param } from "express-validator"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { ReportController } from "../controllers/report.controller"

const router = Router({ mergeParams: true })

// Teacher or admin creates a report for a class
router.post(
  "/reports",
  authenticate,
  authorize("teacher", "admin"),
  param("id").isString().withMessage("Class ID is required"),
  body("title").isString().notEmpty().withMessage("Title is required"),
  body("content").isString().notEmpty().withMessage("Content is required"),
  ReportController.createReport
)

// Admin or principal views reports for a class
router.get(
  "/reports",
  authenticate,
  authorize("admin", "principal"),
  param("id").isString().withMessage("Class ID is required"),
  ReportController.getReportsForClass
)

export default router
