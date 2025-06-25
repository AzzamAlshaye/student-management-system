// src/controllers/auth.controller.ts
import { RequestHandler } from "express"
import { AuthService } from "../service/auth.service"
import { CREATED, OK } from "../utils/http-status"

/**
 * Sign in an existing user and return a JWT
 */
export const signin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { token } = await AuthService.login(email, password)
    res.status(OK).json({ token })
  } catch (err) {
    next(err)
  }
}

/**
 * Sign out the current user by blacklisting the JWT
 */
export const signout: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    AuthService.logout(authHeader)
    res.status(OK).json({ success: true, message: "Signed out successfully" })
  } catch (err) {
    next(err)
  }
}
