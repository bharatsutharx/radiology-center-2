"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, Package, Download, FileText } from "lucide-react"
import { AttendanceDataManager, InventoryDataManager } from "@/lib/data-storage"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ReportsPage() {
  const router = useRouter()
  const [reportType, setReportType] = useState("attendance")
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  // Generate attendance analytics
  const getAttendanceAnalytics = () => {
    const allData = AttendanceDataManager.getAllAttendanceData()
    const analytics = []

    Object.entries(allData).forEach(([date, records]) => {
      if (date >= dateRange.start && date <= dateRange.end) {
        const stats = {
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          present: records.filter((r) => r.status === "Present").length,
          absent: records.filter((r) => r.status === "Absent").length,
          late: records.filter((r) => r.status === "Late").length,
          halfDay: records.filter((r) => r.status === "Half Day").length,
          total: records.length,
        }
        analytics.push(stats)
      }
    })

    return analytics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Generate inventory analytics
  const getInventoryAnalytics = () => {
    const data = InventoryDataManager.getInventoryData()
    const categoryStats: Record<string, { total: number; lowStock: number; inStock: number }> = {}

    data.forEach((item) => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { total: 0, lowStock: 0, inStock: 0 }
      }
      categoryStats[item.category].total++
      if (item.quantity <= item.minStock) {
        categoryStats[item.category].lowStock++
      } else {
        categoryStats[item.category].inStock++
      }
    })

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      ...stats,
    }))
  }

  // Generate staff performance data
  const getStaffPerformance = () => {
    const allData = AttendanceDataManager.getAllAttendanceData()
    const staffStats: Record<
      string,
      { present: number; absent: number; late: number; halfDay: number; total: number }
    > = {}

    Object.entries(allData).forEach(([date, records]) => {
      if (date >= dateRange.start && date <= dateRange.end) {
        records.forEach((record) => {
          if (!staffStats[record.name]) {
            staffStats[record.name] = { present: 0, absent: 0, late: 0, halfDay: 0, total: 0 }
          }
          staffStats[record.name].total++
          staffStats[record.name][record.status.toLowerCase().replace(" ", "") as keyof (typeof staffStats)[string]]++
        })
      }
    })

    return Object.entries(staffStats).map(([name, stats]) => ({
      name,
      attendanceRate: (((stats.present + stats.late + stats.halfDay) / stats.total) * 100).toFixed(1),
      ...stats,
    }))
  }

  const attendanceData = getAttendanceAnalytics()
  const inventoryData = getInventoryAnalytics()
  const staffPerformance = getStaffPerformance()

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const exportReport = () => {
    const reportData = {
      type: reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      data: reportType === "attendance" ? attendanceData : inventoryData,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            </div>
            <p className="text-gray-600">Comprehensive analytics and reporting for attendance and inventory</p>
          </div>

          {/* Report Controls */}
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendance">Attendance Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="staff">Staff Performance</SelectItem>
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
                <Button onClick={exportReport} className="bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Reports */}
          {reportType === "attendance" && (
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Daily Attendance Trends
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Attendance patterns over the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ChartContainer
                    config={{
                      present: { label: "Present", color: "hsl(var(--chart-1))" },
                      absent: { label: "Absent", color: "hsl(var(--chart-2))" },
                      late: { label: "Late", color: "hsl(var(--chart-3))" },
                      halfDay: { label: "Half Day", color: "hsl(var(--chart-4))" },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="present" stroke="var(--color-present)" strokeWidth={2} />
                        <Line type="monotone" dataKey="absent" stroke="var(--color-absent)" strokeWidth={2} />
                        <Line type="monotone" dataKey="late" stroke="var(--color-late)" strokeWidth={2} />
                        <Line type="monotone" dataKey="halfDay" stroke="var(--color-halfDay)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Inventory Reports */}
          {reportType === "inventory" && (
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Inventory by Category
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Stock levels across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ChartContainer
                    config={{
                      total: { label: "Total Items", color: "hsl(var(--chart-1))" },
                      inStock: { label: "In Stock", color: "hsl(var(--chart-2))" },
                      lowStock: { label: "Low Stock", color: "hsl(var(--chart-3))" },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={inventoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="inStock" fill="var(--color-inStock)" name="In Stock" />
                        <Bar dataKey="lowStock" fill="var(--color-lowStock)" name="Low Stock" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Staff Performance Reports */}
          {reportType === "staff" && (
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Staff Performance Overview
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Individual staff attendance rates and performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium">Staff Name</th>
                          <th className="text-left py-3 px-4 font-medium">Attendance Rate</th>
                          <th className="text-left py-3 px-4 font-medium">Present Days</th>
                          <th className="text-left py-3 px-4 font-medium">Absent Days</th>
                          <th className="text-left py-3 px-4 font-medium">Late Days</th>
                          <th className="text-left py-3 px-4 font-medium">Half Days</th>
                          <th className="text-left py-3 px-4 font-medium">Total Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffPerformance.map((staff, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{staff.name}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${staff.attendanceRate}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{staff.attendanceRate}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-green-600 font-medium">{staff.present}</td>
                            <td className="py-3 px-4 text-red-600 font-medium">{staff.absent}</td>
                            <td className="py-3 px-4 text-orange-600 font-medium">{staff.late}</td>
                            <td className="py-3 px-4 text-amber-600 font-medium">{staff.halfDay}</td>
                            <td className="py-3 px-4 font-medium">{staff.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
