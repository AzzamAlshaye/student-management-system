// src/routes/user.routes.ts
import { Router } from "express"
import * as userCtrl from "../controllers/user.controller"

const router = Router()

router.post("/", userCtrl.createUser)
router.get("/", userCtrl.getAllUsers)
router.get("/:id", userCtrl.getUserById)
router.put("/:id", userCtrl.updateUser)
router.delete("/:id", userCtrl.deleteUser)

export default router
