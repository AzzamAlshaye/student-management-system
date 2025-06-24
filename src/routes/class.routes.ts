// src/routes/class.routes.ts
import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { ClassController } from "../controllers/class.controller"

const router = Router()

// Create a new class (admin only)
router.post("/", authenticate, authorize("admin"), ClassController.createClass)

// Read all classes (RBAC inside controller)
router.get("/", authenticate, ClassController.getClasses)

// Read a single class by ID
router.get("/:id", authenticate, ClassController.getClassById)

export default router
