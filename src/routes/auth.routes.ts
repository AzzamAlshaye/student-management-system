// src/routes/auth.routes.ts
import { Router } from "express"
import { signin, signout } from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth.middleware"

const router = Router()

// POST /auth/signin
router.post("/signin", signin)

// POST /auth/signout  (must be logged in)
router.post("/signout", authenticate, signout)

export default router
