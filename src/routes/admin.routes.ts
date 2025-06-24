// // src/routes/admin.routes.ts
// import { Router } from "express"
// import * as adminCtrl from "../controllers/admin.controller"

// const router = Router()

// // Students & Teachers
// router.post("/students", adminCtrl.addStudent)
// router.post("/teachers", adminCtrl.addTeacher)

// // Classes
// router.post("/classes", adminCtrl.createClass)
// router.put("/classes/:id/students", adminCtrl.assignStudentsToClass)
// router.put("/classes/:id/teachers", adminCtrl.assignTeachersToClass)
// router.put("/classes/:id/principal", adminCtrl.assignPrincipalToClass)

// // Leaves / Excuses
// router.patch("/leaves/:id/accept", adminCtrl.acceptLeave)
// router.patch("/leaves/:id/reject", adminCtrl.rejectLeave)

// // Reports
// router.get("/reports", adminCtrl.viewReports)

// export default router
