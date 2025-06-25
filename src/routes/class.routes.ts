import { Router } from "express"
import { body, param } from "express-validator"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { ClassController } from "../controllers/class.controller"

const router = Router()

// Create a new class (admin only)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  body("name").isString().notEmpty().withMessage("Class name is required"),
  body("description").optional().isString(),
  ClassController.createClass
)

// Read all classes
router.get(
  "/",
  authenticate,
  authorize("admin", "principal", "teacher", "student"),
  ClassController.getClasses
)

// Read a single class by ID
router.get(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher", "student"),
  param("id").isString().notEmpty().withMessage("Class ID is required"),
  ClassController.getClassById
)

export default router
