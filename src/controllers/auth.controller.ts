import { RequestHandler } from "express"
import { validationResult } from "express-validator"
import { AuthService } from "../service/auth.service"
import { CREATED, OK } from "../utils/http-status"

export const signin: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }

  try {
    const { email, password } = req.body
    const { token } = await AuthService.login(email, password)
    res.status(OK).json({ token })
  } catch (err) {
    next(err)
  }
}

export const signout: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    AuthService.logout(authHeader)
    res.status(OK).json({ success: true, message: "Signed out successfully" })
  } catch (err) {
    next(err)
  }
}
