"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react"
import { AttendanceDataManager, InventoryDataManager, initializeDefaultData } from "@/lib/data-storage"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState({
    totalStaff: 0,
    presentToday: 0,
    absentToday: 0,
    totalInventoryItems: 0,
    lowStockItems: 0,
    recentActivity: [] as any[],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      loadDashboardData()
    }
  }, [router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      await initializeDefaultData()

      const today = new Date().toISOString().split("T")[0]
      const [attendanceData, inventoryData] = await Promise.all([
        AttendanceDataManager.getAttendanceData(today),
        InventoryDataManager.getInventoryData(),
      ])

      setDashboardData({
        totalStaff: attendanceData.length,
        presentToday: attendanceData.filter((record) => record.status === "Present").length,
        absentToday: attendanceData.filter((record) => record.status === "Absent").length,
        totalInventoryItems: inventoryData.length,
        lowStockItems: inventoryData.filter((item) => item.quantity <= item.minStock).length,
        recentActivity: [
          { type: "attendance", message: "5 staff members checked in", time: "2 hours ago" },
          { type: "inventory", message: "Low stock alert: X-Ray Films", time: "4 hours ago" },
          { type: "system", message: "Daily backup completed", time: "6 hours ago" },
        ],
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate sample chart data
  const getWeeklyAttendanceData = async () => {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const dayData = await AttendanceDataManager.getAttendanceData(dateStr)

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        present: dayData.filter((r) => r.status === "Present").length,
        absent: dayData.filter((r) => r.status === "Absent").length,
      })
    }
    return data
  }

  const [weeklyData, setWeeklyData] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading) {
      getWeeklyAttendanceData().then(setWeeklyData)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              Welcome back! Here's what's happening at your radiology center today.
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Total Staff</CardTitle>
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">{dashboardData.totalStaff}</div>
                <p className="text-xs text-blue-100 mt-1">Registered staff members</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">Present Today</CardTitle>
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">{dashboardData.presentToday}</div>
                <p className="text-xs text-green-100 mt-1">Staff present today</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Inventory Items</CardTitle>
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">{dashboardData.totalInventoryItems}</div>
                <p className="text-xs text-purple-100 mt-1">Total items in stock</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-100">Low Stock Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">{dashboardData.lowStockItems}</div>
                <p className="text-xs text-red-100 mt-1">Items need restocking</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Weekly Attendance Chart */}
            <Card className="xl:col-span-2 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                  Weekly Attendance Overview
                </CardTitle>
                <CardDescription className="text-blue-100 text-sm">
                  Staff attendance for the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ChartContainer
                  config={{
                    present: { label: "Present", color: "hsl(var(--chart-1))" },
                    absent: { label: "Absent", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[200px] sm:h-[250px] lg:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="present" fill="var(--color-present)" name="Present" />
                      <Bar dataKey="absent" fill="var(--color-absent)" name="Absent" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-green-100 text-sm">Latest system updates</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === "attendance" && (
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        {activity.type === "inventory" && (
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                        )}
                        {activity.type === "system" && (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6 sm:mt-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used admin functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => router.push("/admin/attendance")}
                  className="h-16 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Manage Attendance</span>
                </Button>
                <Button
                  onClick={() => router.push("/admin/inventory")}
                  className="h-16 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Package className="h-6 w-6" />
                  <span className="text-sm">Update Inventory</span>
                </Button>
                <Button
                  onClick={() => router.push("/admin/reports")}
                  className="h-16 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">View Reports</span>
                </Button>
                <Button
                  onClick={() => router.push("/admin/staff-analytics")}
                  className="h-16 flex flex-col items-center justify-center space-y-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Staff Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
