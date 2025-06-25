// src/routes/user.routes.ts
import { Router } from "express"
import UserController from "../controllers/user.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"

const router = Router()

// ─── Users CRUD (admin only) ─────────────────────────
router.post("/", authenticate, authorize("admin"), UserController.createUser)
router.get("/", authenticate, authorize("admin"), UserController.getUsers)
router.get("/:id", authenticate, authorize("admin"), UserController.getUserById)
router.put("/:id", authenticate, authorize("admin"), UserController.updateUser)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  UserController.deleteUser
)

// ─── “Me” Endpoints ───────────────────────────────────
router.get(
  "/teachers",
  authenticate,
  authorize("student", "admin"),
  UserController.getMyTeachers
)
router.get(
  "/students",
  authenticate,
  authorize("teacher", "admin"),
  UserController.getMyStudents
)

// ─── Related Users via Params ─────────────────────────
router.get(
  "/:userId/students",
  authenticate,
  authorize("admin", "teacher"),
  UserController.getRelatedStudents
)
router.get(
  "/:userId/teachers",
  authenticate,
  authorize("admin", "student"),
  UserController.getRelatedTeachers
)

// ─── Leaves Sub-Routes ────────────────────────────────
// View any user’s leaves (admin, principal, teacher, student)
router.get(
  "/:userId/leaves",
  authenticate,
  authorize("admin", "principal", "teacher", "student"),
  UserController.getUserLeaves
)

// Accept/reject leave (principal, admin only)
router.put(
  "/:userId/leaves/:leaveId/accept",
  authenticate,
  authorize("principal", "admin"),
  UserController.acceptLeave
)
router.put(
  "/:userId/leaves/:leaveId/reject",
  authenticate,
  authorize("principal", "admin"),
  UserController.rejectLeave
)

export default router
