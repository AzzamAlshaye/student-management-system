// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UsersCollection, UserDocument, UserRole } from "../models/user.model"
import { jwtConfig } from "../config/jwt"
import { AppError } from "../utils/error"
import { UNAUTHORIZED, FORBIDDEN } from "../utils/http-status"

// Allow adding `user` property to Express Request
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument
    }
  }
}

// 1) Authenticate: verify JWT & load user into req.user
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("You are not logged in", UNAUTHORIZED)
    }
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      sub: string
      iat: number
      exp: number
    }

    // lookup by your custom `id` field (because sub === user.id)
    const user = await UsersCollection.findOne({ id: decoded.sub })
    if (!user) {
      throw new AppError("User no longer exists", UNAUTHORIZED)
    }

    req.user = user
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new AppError("Token has expired", UNAUTHORIZED))
    } else {
      next(new AppError("Invalid token", UNAUTHORIZED))
    }
  }
}

// 2) Authorize: ensure req.user.role is one of the allowed roles
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user
    if (!user) {
      return next(new AppError("You are not logged in", UNAUTHORIZED))
    }
    if (!allowedRoles.includes(user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          FORBIDDEN
        )
      )
    }
    next()
  }
}
