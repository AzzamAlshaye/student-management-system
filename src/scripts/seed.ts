// seed.ts
import "dotenv/config"
import { connectDB } from "../config/database"
import { UsersCollection } from "../models/user.model" // :contentReference[oaicite:3]{index=3}
import { ClassesCollection } from "../models/class.model" // :contentReference[oaicite:4]{index=4}
import { ParticipantCollection } from "../models/participant.model" // :contentReference[oaicite:5]{index=5}
import { ReportCollection } from "../models/report.model" // :contentReference[oaicite:6]{index=6}
import { AttendanceCollection } from "../models/attendance.model" // :contentReference[oaicite:7]{index=7}
import { LeaveCollection } from "../models/leave.model" // :contentReference[oaicite:8]{index=8}

/** Return a random Date within the past `days` days */
function randomDateWithinDays(days: number): Date {
  const now = Date.now()
  const past = now - days * 24 * 60 * 60 * 1000
  return new Date(past + Math.random() * (now - past))
}

async function seed() {
  // 1. Connect
  await connectDB()

  // 2. Wipe existing data
  await Promise.all([
    UsersCollection.deleteMany({}),
    ClassesCollection.deleteMany({}),
    ParticipantCollection.deleteMany({}),
    ReportCollection.deleteMany({}),
    AttendanceCollection.deleteMany({}),
    LeaveCollection.deleteMany({}),
  ])

  // 3. Create users
  const admin = await UsersCollection.create({
    email: "admin@admin.com",
    password: "admin123",
    role: "admin",
  })
  const principals = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      UsersCollection.create({
        email: `principal${i + 1}@gmail.com`,
        password: "password123",
        role: "principal",
      })
    )
  )
  const teachers = await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      UsersCollection.create({
        email: `teacher${i + 1}@gmail.com`,
        password: "password123",
        role: "teacher",
      })
    )
  )
  const students = await Promise.all(
    Array.from({ length: 200 }, (_, i) =>
      UsersCollection.create({
        email: `student${i + 1}@gmail.com`,
        password: "password123",
        role: "student",
      })
    )
  )

  // 4. Create classes
  const classes = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      ClassesCollection.create({
        name: `Class ${i + 1}`,
        description: `Auto-generated class #${i + 1}`,
      })
    )
  )

  // 5. Assign participants (1 principal, 2 teachers, 20 students per class)
  classes.forEach(async (clazz, idx) => {
    const classId = clazz.id
    // 1 principal
    await ParticipantCollection.create({ classId, userId: principals[idx].id })
    // 2 teachers
    const sliceT = teachers.slice(idx * 2, idx * 2 + 2)
    await ParticipantCollection.insertMany(
      sliceT.map((t) => ({ classId, userId: t.id }))
    )
    // 20 students
    const sliceS = students.slice(idx * 20, idx * 20 + 20)
    await ParticipantCollection.insertMany(
      sliceS.map((s) => ({ classId, userId: s.id }))
    )
  })

  // 6. Generate 20 Reports
  for (let i = 1; i <= 20; i++) {
    const idx = Math.floor(Math.random() * classes.length)
    const clazz = classes[idx]
    // pick one of its 2 teachers
    const teacher = teachers[idx * 2 + Math.floor(Math.random() * 2)]
    await ReportCollection.create({
      classId: clazz.id,
      teacherId: teacher.id,
      title: `Auto Report ${i}`,
      content: `Generated report for ${clazz.name}`,
    })
  }

  // 7. Generate 20 Attendance records
  const statuses = ["present", "absent", "late", "excused"] as const
  for (let i = 1; i <= 20; i++) {
    const idx = Math.floor(Math.random() * classes.length)
    const clazz = classes[idx]
    const studentList = students.slice(idx * 20, idx * 20 + 20)
    const student = studentList[Math.floor(Math.random() * studentList.length)]
    await AttendanceCollection.create({
      classId: clazz.id,
      attendeeId: student.id,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      attendedAt: randomDateWithinDays(30),
    })
  }

  // 8. Generate 20 Leave requests
  const types = ["sick", "vacation", "personal", "other"] as const
  for (let i = 1; i <= 20; i++) {
    const idx = Math.floor(Math.random() * classes.length)
    const clazz = classes[idx]
    const studentList = students.slice(idx * 20, idx * 20 + 20)
    const student = studentList[Math.floor(Math.random() * studentList.length)]
    await LeaveCollection.create({
      classId: clazz.id,
      user: student.id,
      leaveAt: randomDateWithinDays(30),
      leaveType: types[Math.floor(Math.random() * types.length)],
      // status defaults to "pending"
    })
  }

  console.log("✅ Seeding complete!")
  process.exit(0)
}

// Run!
seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
