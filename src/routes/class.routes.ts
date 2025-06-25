// src/routes/class.routes.ts
import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { ClassController } from "../controllers/class.controller"

const router = Router()

// Create a new class (admin only)
router.post("/", authenticate, authorize("admin"), ClassController.createClass)

// Read all classes (admin, principal, teacher, student)
router.get(
  "/",
  authenticate,
  authorize("admin", "principal", "teacher", "student"),
  ClassController.getClasses
)

// Read a single class by ID (admin, principal, teacher, student)
router.get(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher", "student"),
  ClassController.getClassById
)

export default router
