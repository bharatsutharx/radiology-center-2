"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  BarChart3,
} from "lucide-react"
import { StaffAnalyticsManager, type StaffAnalytics } from "@/lib/staff-analytics"
import { ExportManager } from "@/lib/export-utils"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function StaffAnalyticsPage() {
  const router = useRouter()
  const [selectedStaff, setSelectedStaff] = useState("")
  const [staffList, setStaffList] = useState<string[]>([])
  const [analytics, setAnalytics] = useState<StaffAnalytics | null>(null)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 90 days ago
    end: new Date().toISOString().split("T")[0],
  })
  const [staffComparison, setStaffComparison] = useState<any[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      loadStaffList()
      loadStaffComparison()
    }
  }, [router, dateRange])

  useEffect(() => {
    if (selectedStaff) {
      loadStaffAnalytics()
    }
  }, [selectedStaff, dateRange])

  const loadStaffList = () => {
    const list = StaffAnalyticsManager.getAllStaffList()
    setStaffList(list)
    if (list.length > 0 && !selectedStaff) {
      setSelectedStaff(list[0])
    }
  }

  const loadStaffAnalytics = () => {
    if (selectedStaff) {
      const data = StaffAnalyticsManager.getDetailedStaffAnalytics(selectedStaff, dateRange.start, dateRange.end)
      setAnalytics(data)
    }
  }

  const loadStaffComparison = () => {
    const comparison = StaffAnalyticsManager.getStaffComparison(dateRange.start, dateRange.end)
    setStaffComparison(comparison)
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-green-100 text-green-800"
      case "B+":
      case "B":
        return "bg-blue-100 text-blue-800"
      case "C+":
      case "C":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  const exportStaffReport = (format: "excel" | "pdf") => {
    if (!selectedStaff) return

    if (format === "excel") {
      ExportManager.exportStaffPerformanceToExcel(selectedStaff, dateRange.start, dateRange.end)
    } else {
      ExportManager.exportStaffPerformanceToPDF(selectedStaff, dateRange.start, dateRange.end)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Analytics & Performance</h1>
            </div>
            <p className="text-gray-600">Detailed staff performance analysis and attendance insights</p>
          </div>

          {/* Controls */}
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Analysis Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <Label htmlFor="staff-select">Select Staff Member</Label>
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffList.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => exportStaffReport("excel")}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!selectedStaff}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button onClick={() => exportStaffReport("pdf")} variant="outline" disabled={!selectedStaff}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {analytics && (
            <>
              {/* Performance Overview - Make fully responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-100">Attendance Rate</CardTitle>
                    <TrendingUp className="h-5 w-5 text-blue-200" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.attendanceRate.toFixed(1)}%</div>
                    <Progress value={analytics.attendanceRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-100">Present Days</CardTitle>
                    <Calendar className="h-5 w-5 text-green-200" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.presentDays}</div>
                    <p className="text-xs text-green-100 mt-1">out of {analytics.totalDays} days</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-100">Avg Hours/Day</CardTitle>
                    <Clock className="h-5 w-5 text-purple-200" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.averageHours.toFixed(1)}h</div>
                    <p className="text-xs text-purple-100 mt-1">working hours</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-100">Performance</CardTitle>
                    <Award className="h-5 w-5 text-amber-200" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analytics.performanceGrade}</div>
                    <p className="text-xs text-amber-100 mt-1">grade</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics - Responsive layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                {/* Monthly Breakdown Chart */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6" />
                      Monthly Attendance Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ChartContainer
                      config={{
                        present: { label: "Present", color: "hsl(var(--chart-1))" },
                        absent: { label: "Absent", color: "hsl(var(--chart-2))" },
                        late: { label: "Late", color: "hsl(var(--chart-3))" },
                        halfDay: { label: "Half Day", color: "hsl(var(--chart-4))" },
                      }}
                      className="h-[200px] sm:h-[250px] lg:h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.monthlyBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="present" fill="var(--color-present)" name="Present" />
                          <Bar dataKey="absent" fill="var(--color-absent)" name="Absent" />
                          <Bar dataKey="late" fill="var(--color-late)" name="Late" />
                          <Bar dataKey="halfDay" fill="var(--color-halfDay)" name="Half Day" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Performance Insights */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-6 w-6" />
                      Performance Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{analytics.perfectAttendanceDays}</div>
                          <div className="text-sm text-green-700">Perfect Days</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{analytics.longestAbsentStreak}</div>
                          <div className="text-sm text-red-700">Max Absent Streak</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Performance Grade</h4>
                        <Badge className={`text-lg px-4 py-2 ${getGradeColor(analytics.performanceGrade)}`}>
                          {analytics.performanceGrade}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">Key Metrics</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Late Minutes (Total):</span>
                            <span className="font-medium">{analytics.lateMinutes} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Absent Days:</span>
                            <span className="font-medium">{analytics.absentDays}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Late Days:</span>
                            <span className="font-medium">{analytics.lateDays}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Recommendations & Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {analytics.recommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
                      >
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-800">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    Recent Activity (Last 10 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Check In</th>
                          <th className="text-left py-3 px-4 font-medium">Check Out</th>
                          <th className="text-left py-3 px-4 font-medium">Hours</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.recentActivity.map((record, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{new Date(record.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">{record.checkIn}</td>
                            <td className="py-3 px-4">{record.checkOut}</td>
                            <td className="py-3 px-4">{record.hours}</td>
                            <td className="py-3 px-4">
                              <Badge
                                className={
                                  record.status === "Present"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "Absent"
                                      ? "bg-red-100 text-red-800"
                                      : record.status === "Late"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {record.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Staff Comparison - Add mobile layout */}
          <Card className="mt-6 sm:mt-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-6 w-6" />
                Staff Performance Comparison
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm">
                Compare all staff members' performance for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile Card Layout */}
              <div className="block lg:hidden divide-y divide-gray-200">
                {staffComparison.map((staff, index) => (
                  <div key={index} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-blue-600">#{index + 1}</span>
                          <h3 className="font-medium text-gray-900">{staff.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{staff.role}</p>
                      </div>
                      <Badge className={getGradeColor(staff.performanceGrade)}>{staff.performanceGrade}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Attendance Rate</span>
                        <span className="text-sm font-medium">{staff.attendanceRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${staff.attendanceRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Present:</span>
                        <span className="ml-1 font-medium text-green-600">{staff.presentDays}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Absent:</span>
                        <span className="ml-1 font-medium text-red-600">{staff.absentDays}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Rank</th>
                      <th className="text-left py-3 px-4 font-medium">Staff Name</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Attendance Rate</th>
                      <th className="text-left py-3 px-4 font-medium">Present Days</th>
                      <th className="text-left py-3 px-4 font-medium">Absent Days</th>
                      <th className="text-left py-3 px-4 font-medium">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffComparison.map((staff, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-bold text-lg">#{index + 1}</td>
                        <td className="py-3 px-4 font-medium">{staff.name}</td>
                        <td className="py-3 px-4 text-gray-600">{staff.role}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${staff.attendanceRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{staff.attendanceRate.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-green-600 font-medium">{staff.presentDays}</td>
                        <td className="py-3 px-4 text-red-600 font-medium">{staff.absentDays}</td>
                        <td className="py-3 px-4">
                          <Badge className={getGradeColor(staff.performanceGrade)}>{staff.performanceGrade}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
