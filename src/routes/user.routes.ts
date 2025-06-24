// src/routes/user.routes.ts
import { Router } from "express"
import UserController from "../controllers/user.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"

const router = Router()

// ─── Users CRUD ────────────────────────────────────

// Create a new user (admin only)
router.post(
  "/users",
  authenticate,
  authorize("admin"),
  UserController.createUser
)

// Read all users (RBAC inside controller)
router.get("/users", authenticate, UserController.getUsers)

// Read one user by ID
router.get("/users/:id", authenticate, UserController.getUserById)

// Update a user by ID (admin only)
router.put(
  "/users/:id",
  authenticate,
  authorize("admin"),
  UserController.updateUser
)

// Delete a user by ID (admin only)
router.delete(
  "/users/:id",
  authenticate,
  authorize("admin"),
  UserController.deleteUser
)

// ─── Leaves Sub-Routes ─────────────────────────────

// Get all leaves for a given user
router.get(
  "/users/:userId/leaves",
  authenticate,
  authorize("admin", "principal", "teacher", "student"),
  UserController.getUserLeaves
)

// Accept a specific leave (admin/principal/teacher)
router.put(
  "/users/:userId/leaves/:leaveId/accept",
  authenticate,
  authorize("admin", "principal", "teacher"),
  UserController.acceptLeave
)

// Reject a specific leave (admin/principal/teacher)
router.put(
  "/users/:userId/leaves/:leaveId/reject",
  authenticate,
  authorize("admin", "principal", "teacher"),
  UserController.rejectLeave
)

export default router
