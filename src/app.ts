import "dotenv/config" // load .env first
import dotenv from "dotenv" // optional if you prefer dotenv.config()
import express, { Express, Request, Response, NextFunction } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import logger from "./utils/logger"
// import adminRoutes from "./routes/admin.routes"
import { dev, port } from "./utils/helpers"
import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes"
import classRouter from "./routes/class.routes"
import participantRouter from "./routes/participant.routes"
import attendanceRouter from "./routes/attendance.routes"
import leaveRouter from "./routes/leave.routes"
import reportRouter from "./routes/report.routes"
import { connectDB } from "./config/database"
import { OK, INTERNAL_SERVER_ERROR } from "./utils/http-status"
import { errorHandler } from "./middleware/error.middleware"

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

// Create Express app
const app: Express = express()

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors())
app.use(helmet())
app.use(
  morgan("tiny", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Routes ────────────────────────────────────────────────────────────────────
// Make sure this comes *after* express.json() and *before* your error handler
app.use("/auth", authRouter)
app.use("/users", userRouter)
// app.use("/api/admin", adminRoutes)
app.use("/classes", classRouter)
app.use("/classes/:id", participantRouter)
app.use("/classes/:id", attendanceRouter)
app.use("/classes/:id", leaveRouter)
app.use("/classes/:id", reportRouter)
app.use(errorHandler)
// Health check
app.get("/", (_req: Request, res: Response<{ message: string }>) => {
  res.status(OK).json({ message: "API is running!" })
})

// ─── Error Handling ────────────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Error:", err.message)
  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Something went wrong!",
    error: dev ? err.message : undefined,
  })
})

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
