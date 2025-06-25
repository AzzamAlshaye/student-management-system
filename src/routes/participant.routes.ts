import { Router } from "express"
import { param, body } from "express-validator"
import { authenticate, authorize } from "../middleware/auth.middleware"
import ParticipantController from "../controllers/participant.controller"

const router = Router({ mergeParams: true })

router.post(
  "/students",
  authenticate,
  authorize("admin"),
  param("id").isString().withMessage("Class ID is required"),
  body("studentIds")
    .isArray({ min: 1 })
    .withMessage("At least one studentId is required"),
  body("studentIds.*").isString(),
  ParticipantController.addStudentsToClass
)

router.post(
  "/teachers",
  authenticate,
  authorize("admin"),
  param("id").isString().withMessage("Class ID is required"),
  body("teacherIds")
    .isArray({ min: 1 })
    .withMessage("At least one teacherId is required"),
  body("teacherIds.*").isString(),
  ParticipantController.addTeachersToClass
)

router.get(
  "/students",
  authenticate,
  authorize("admin", "principal", "teacher"),
  param("id").isString().withMessage("Class ID is required"),
  ParticipantController.getClassStudents
)

router.get(
  "/teachers",
  authenticate,
  authorize("admin", "principal", "teacher"),
  param("id").isString().withMessage("Class ID is required"),
  ParticipantController.getClassTeachers
)

export default router
