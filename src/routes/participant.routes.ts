// src/routes/participant.routes.ts
import { Router } from "express"
import { authenticate, authorize } from "../middleware/auth.middleware"
import { ParticipantController } from "../controllers/participant.controller"

const router = Router({ mergeParams: true })

// Add students to class (admin only)
router.post(
  "/students",
  authenticate,
  authorize("admin"),
  ParticipantController.addStudentsToClass
)

// Add teachers to class (admin only)
router.post(
  "/teachers",
  authenticate,
  authorize("admin"),
  ParticipantController.addTeachersToClass
)

// List students in class
router.get("/students", authenticate, ParticipantController.getClassStudents)

// List teachers in class
router.get("/teachers", authenticate, ParticipantController.getClassTeachers)

export default router
