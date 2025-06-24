// src/services/report.service.ts
import { ReportCollection } from "../models/report.model"
import { ReportDocument } from "../models/report.model"

export class ReportService {
  static async createReport(data: Partial<ReportDocument>) {
    return ReportCollection.create(data)
  }

  static async getReportsForClass(classId: string) {
    return ReportCollection.find({ classId }).lean()
  }
}
