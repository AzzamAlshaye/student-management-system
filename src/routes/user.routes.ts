import { Router } from "express"
import { param, body } from "express-validator"
import UserController from "../controllers/user.controller"
import { authenticate, authorize } from "../middleware/auth.middleware"

const router = Router()

// Users CRUD (admin only)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars"),
  body("role")
    .isIn(["student", "teacher", "principal", "admin"])
    .withMessage("Role must be one of student, teacher, principal, admin"),
  UserController.createUser
)

router.get("/", authenticate, authorize("admin"), UserController.getUsers)

router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  param("id").isString().notEmpty(),
  UserController.getUserById
)

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  param("id").isString().notEmpty(),
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 8 }),
  body("role").optional().isIn(["student", "teacher", "principal", "admin"]),
  UserController.updateUser
)

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  param("id").isString().notEmpty(),
  UserController.deleteUser
)

// “Me” Endpoints
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

// Related Users via Params
router.get(
  "/:userId/students",
  authenticate,
  authorize("admin", "teacher"),
  param("userId").isString().notEmpty(),
  UserController.getRelatedStudents
)
router.get(
  "/:userId/teachers",
  authenticate,
  authorize("admin", "student"),
  param("userId").isString().notEmpty(),
  UserController.getRelatedTeachers
)

// Leaves Sub-Routes
router.get(
  "/:userId/leaves",
  authenticate,
  authorize("admin", "principal", "teacher", "student"),
  param("userId").isString(),
  UserController.getUserLeaves
)

router.put(
  "/:userId/leaves/:leaveId/accept",
  authenticate,
  authorize("principal", "admin"),
  param("userId").isString(),
  param("leaveId").isString(),
  UserController.acceptLeave
)

router.put(
  "/:userId/leaves/:leaveId/reject",
  authenticate,
  authorize("principal", "admin"),
  param("userId").isString(),
  param("leaveId").isString(),
  UserController.rejectLeave
)

export default router
