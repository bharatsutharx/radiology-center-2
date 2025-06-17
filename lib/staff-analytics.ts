import { AttendanceDataManager, type AttendanceRecord } from "./data-storage"

export interface StaffAnalytics {
  name: string
  role: string
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  halfDays: number
  attendanceRate: number
  averageHours: number
  lateMinutes: number
  perfectAttendanceDays: number
  longestAbsentStreak: number
  monthlyBreakdown: MonthlyBreakdown[]
  recentActivity: AttendanceRecord[]
  performanceGrade: string
  recommendations: string[]
}

export interface MonthlyBreakdown {
  month: string
  present: number
  absent: number
  late: number
  halfDay: number
  totalDays: number
  attendanceRate: number
}

export class StaffAnalyticsManager {
  static getDetailedStaffAnalytics(staffName: string, startDate: string, endDate: string): StaffAnalytics {
    const allData = AttendanceDataManager.getAllAttendanceData()
    const staffRecords: AttendanceRecord[] = []

    // Collect all records for the staff member
    Object.entries(allData).forEach(([date, records]) => {
      if (date >= startDate && date <= endDate) {
        const staffRecord = records.find((r) => r.name === staffName)
        if (staffRecord) {
          staffRecords.push(staffRecord)
        } else {
          // Create absent record for missing days
          staffRecords.push({
            id: 0,
            name: staffName,
            role: this.getStaffRole(staffName, allData),
            date,
            checkIn: "-",
            checkOut: "-",
            status: "Absent",
            hours: "0h",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        }
      }
    })

    // Calculate basic stats
    const totalDays = staffRecords.length
    const presentDays = staffRecords.filter((r) => r.status === "Present").length
    const absentDays = staffRecords.filter((r) => r.status === "Absent").length
    const lateDays = staffRecords.filter((r) => r.status === "Late").length
    const halfDays = staffRecords.filter((r) => r.status === "Half Day").length

    const attendanceRate = totalDays > 0 ? ((presentDays + lateDays + halfDays) / totalDays) * 100 : 0

    // Calculate average hours
    const totalHours = staffRecords
      .filter((r) => r.hours !== "0h" && r.hours !== "-")
      .reduce((sum, r) => sum + Number.parseInt(r.hours.replace("h", "")), 0)
    const workingDays = staffRecords.filter((r) => r.status !== "Absent").length
    const averageHours = workingDays > 0 ? totalHours / workingDays : 0

    // Calculate late minutes
    const lateMinutes = staffRecords
      .filter((r) => r.status === "Late")
      .reduce((sum, r) => sum + this.calculateLateMinutes(r.checkIn), 0)

    // Perfect attendance days (on time, full day)
    const perfectAttendanceDays = staffRecords.filter(
      (r) => r.status === "Present" && r.checkIn <= "08:00" && Number.parseInt(r.hours.replace("h", "")) >= 8,
    ).length

    // Longest absent streak
    const longestAbsentStreak = this.calculateLongestAbsentStreak(staffRecords)

    // Monthly breakdown
    const monthlyBreakdown = this.getMonthlyBreakdown(staffRecords)

    // Recent activity (last 10 records)
    const recentActivity = staffRecords
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

    // Performance grade
    const performanceGrade = this.calculatePerformanceGrade(attendanceRate, lateMinutes, absentDays)

    // Recommendations
    const recommendations = this.generateRecommendations(attendanceRate, lateMinutes, absentDays, lateDays)

    return {
      name: staffName,
      role: this.getStaffRole(staffName, allData),
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      halfDays,
      attendanceRate,
      averageHours,
      lateMinutes,
      perfectAttendanceDays,
      longestAbsentStreak,
      monthlyBreakdown,
      recentActivity,
      performanceGrade,
      recommendations,
    }
  }

  private static getStaffRole(staffName: string, allData: Record<string, AttendanceRecord[]>): string {
    for (const records of Object.values(allData)) {
      const record = records.find((r) => r.name === staffName)
      if (record) return record.role
    }
    return "Unknown"
  }

  private static calculateLateMinutes(checkIn: string): number {
    if (checkIn === "-" || checkIn === "") return 0
    const [hours, minutes] = checkIn.split(":").map(Number)
    const checkInTime = hours * 60 + minutes
    const standardTime = 8 * 60 // 8:00 AM
    return Math.max(0, checkInTime - standardTime)
  }

  private static calculateLongestAbsentStreak(records: AttendanceRecord[]): number {
    let maxStreak = 0
    let currentStreak = 0

    records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    for (const record of records) {
      if (record.status === "Absent") {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }

    return maxStreak
  }

  private static getMonthlyBreakdown(records: AttendanceRecord[]): MonthlyBreakdown[] {
    const monthlyData: Record<string, any> = {}

    records.forEach((record) => {
      const month = record.date.substring(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { present: 0, absent: 0, late: 0, halfDay: 0, totalDays: 0 }
      }

      monthlyData[month].totalDays++
      switch (record.status) {
        case "Present":
          monthlyData[month].present++
          break
        case "Absent":
          monthlyData[month].absent++
          break
        case "Late":
          monthlyData[month].late++
          break
        case "Half Day":
          monthlyData[month].halfDay++
          break
      }
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
      attendanceRate: ((data.present + data.late + data.halfDay) / data.totalDays) * 100,
    }))
  }

  private static calculatePerformanceGrade(attendanceRate: number, lateMinutes: number, absentDays: number): string {
    if (attendanceRate >= 95 && lateMinutes < 30 && absentDays <= 2) return "A+"
    if (attendanceRate >= 90 && lateMinutes < 60 && absentDays <= 4) return "A"
    if (attendanceRate >= 85 && lateMinutes < 120 && absentDays <= 6) return "B+"
    if (attendanceRate >= 80 && lateMinutes < 180 && absentDays <= 8) return "B"
    if (attendanceRate >= 75 && lateMinutes < 240 && absentDays <= 10) return "C+"
    if (attendanceRate >= 70) return "C"
    return "D"
  }

  private static generateRecommendations(
    attendanceRate: number,
    lateMinutes: number,
    absentDays: number,
    lateDays: number,
  ): string[] {
    const recommendations: string[] = []

    if (attendanceRate < 80) {
      recommendations.push("Improve overall attendance rate - currently below acceptable standards")
    }

    if (lateMinutes > 120) {
      recommendations.push("Focus on punctuality - consider adjusting morning routine")
    }

    if (absentDays > 5) {
      recommendations.push("Reduce unplanned absences - consider health and wellness programs")
    }

    if (lateDays > 10) {
      recommendations.push("Consistent tardiness pattern detected - may need schedule adjustment")
    }

    if (attendanceRate >= 95) {
      recommendations.push("Excellent attendance record - consider for recognition programs")
    }

    if (recommendations.length === 0) {
      recommendations.push("Good performance overall - maintain current standards")
    }

    return recommendations
  }

  static getAllStaffList(): string[] {
    const allData = AttendanceDataManager.getAllAttendanceData()
    const staffSet = new Set<string>()

    Object.values(allData).forEach((records) => {
      records.forEach((record) => {
        staffSet.add(record.name)
      })
    })

    return Array.from(staffSet).sort()
  }

  static getStaffComparison(startDate: string, endDate: string) {
    const staffList = this.getAllStaffList()
    return staffList
      .map((staff) => {
        const analytics = this.getDetailedStaffAnalytics(staff, startDate, endDate)
        return {
          name: analytics.name,
          role: analytics.role,
          attendanceRate: analytics.attendanceRate,
          presentDays: analytics.presentDays,
          absentDays: analytics.absentDays,
          performanceGrade: analytics.performanceGrade,
        }
      })
      .sort((a, b) => b.attendanceRate - a.attendanceRate)
  }
}
