// src/routes/user.routes.ts
import { Router } from "express"
import UserController from "../controllers/user.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"

const router = Router()

// ─── Users CRUD ────────────────────────────────────
router.post("/", authenticate, authorize("admin"), UserController.createUser)
router.get("/", authenticate, UserController.getUsers)
router.get("/:id", authenticate, UserController.getUserById)
router.put("/:id", authenticate, authorize("admin"), UserController.updateUser)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  UserController.deleteUser
)

// ─── “Me” Endpoints ────────────────────────────────
// Student fetches their teachers
router.get(
  "/teachers",
  authenticate,
  authorize("student", "admin"),
  UserController.getMyTeachers
)

// Teacher fetches their students
router.get(
  "/students",
  authenticate,
  authorize("teacher", "admin"),
  UserController.getMyStudents
)

// ─── Param-based Related Users ────────────────────
// Teachers can list any teacher’s students; admins too
router.get(
  "/:userId/students",
  authenticate,
  authorize("admin", "teacher"),
  UserController.getRelatedStudents
)
// Students can list any student’s teachers; admins too
router.get(
  "/:userId/teachers",
  authenticate,
  authorize("admin", "student"),
  UserController.getRelatedTeachers
)

// ─── Leaves Sub-Routes ─────────────────────────────
router.get(
  "/:userId/leaves",
  authenticate,
  authorize("admin", "principal", "teacher", "student"),
  UserController.getUserLeaves
)
router.put(
  "/:userId/leaves/:leaveId/accept",
  authenticate,
  authorize("admin", "principal", "teacher"),
  UserController.acceptLeave
)
router.put(
  "/:userId/leaves/:leaveId/reject",
  authenticate,
  authorize("admin", "principal", "teacher"),
  UserController.rejectLeave
)

export default router
