"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Users,
  Search,
  Edit,
  Save,
  X,
  UserPlus,
  Trash2,
  CalendarDays,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type AttendanceRecord, AttendanceDataManager, initializeDefaultData } from "@/lib/data-storage"
import { XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AttendancePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    checkIn: "",
    checkOut: "",
    status: "Present" as const,
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      initializeData()
    }
  }, [router])

  useEffect(() => {
    if (!isLoading) {
      loadAttendanceData()
    }
  }, [selectedDate, isLoading])

  const initializeData = async () => {
    try {
      setIsLoading(true)
      await initializeDefaultData()
      await loadAttendanceData()
    } catch (error) {
      console.error("Error initializing data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadAttendanceData = async () => {
    try {
      const data = await AttendanceDataManager.getAttendanceData(selectedDate)
      setAttendanceData(data)
    } catch (error) {
      console.error("Error loading attendance data:", error)
    }
  }

  const saveAttendanceData = async (data: AttendanceRecord[]) => {
    try {
      await AttendanceDataManager.saveAttendanceData(selectedDate, data)
      setAttendanceData(data)
    } catch (error) {
      console.error("Error saving attendance data:", error)
    }
  }

  const filteredData = attendanceData.filter(
    (record) =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const presentCount = attendanceData.filter((record) => record.status === "Present").length
  const absentCount = attendanceData.filter((record) => record.status === "Absent").length
  const halfDayCount = attendanceData.filter((record) => record.status === "Half Day").length
  const lateCount = attendanceData.filter((record) => record.status === "Late").length

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold transition-colors"
    switch (status) {
      case "Present":
        return (
          <Badge className={cn(baseClasses, "bg-emerald-100 text-emerald-800 hover:bg-emerald-200")}>Present</Badge>
        )
      case "Absent":
        return <Badge className={cn(baseClasses, "bg-red-100 text-red-800 hover:bg-red-200")}>Absent</Badge>
      case "Half Day":
        return <Badge className={cn(baseClasses, "bg-amber-100 text-amber-800 hover:bg-amber-200")}>Half Day</Badge>
      case "Late":
        return <Badge className={cn(baseClasses, "bg-orange-100 text-orange-800 hover:bg-orange-200")}>Late</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const toggleEdit = (id: number) => {
    setAttendanceData((prev) =>
      prev.map((record) => (record.id === id ? { ...record, isEditing: !record.isEditing } : record)),
    )
  }

  const updateRecord = (id: number, field: keyof AttendanceRecord, value: string) => {
    setAttendanceData((prev) => prev.map((record) => (record.id === id ? { ...record, [field]: value } : record)))
  }

  const saveRecord = async (id: number) => {
    const record = attendanceData.find((r) => r.id === id)
    if (record) {
      if (record.checkIn !== "-" && record.checkOut !== "-" && record.status !== "Absent") {
        const checkInHour = Number.parseInt(record.checkIn.split(":")[0])
        const checkOutHour = Number.parseInt(record.checkOut.split(":")[0])
        const hours = Math.abs(checkOutHour - checkInHour)
        updateRecord(id, "hours", `${hours}h`)
      } else if (record.status === "Absent") {
        updateRecord(id, "hours", "0h")
        updateRecord(id, "checkIn", "-")
        updateRecord(id, "checkOut", "-")
      }

      const updatedRecord = { ...record, updatedAt: new Date().toISOString(), isEditing: false }
      const newData = attendanceData.map((r) => (r.id === id ? updatedRecord : r))
      await saveAttendanceData(newData)
    }
    toggleEdit(id)
  }

  const deleteRecord = async (id: number) => {
    if (confirm("Are you sure you want to remove this staff member from attendance?")) {
      const newData = attendanceData.filter((record) => record.id !== id)
      await saveAttendanceData(newData)
    }
  }

  const addNewStaff = async () => {
    const newId = Math.max(...attendanceData.map((r) => r.id), 0) + 1
    const hours =
      newStaff.status === "Absent"
        ? "0h"
        : newStaff.checkIn && newStaff.checkOut
          ? `${Math.abs(Number.parseInt(newStaff.checkOut.split(":")[0]) - Number.parseInt(newStaff.checkIn.split(":")[0]))}h`
          : "0h"

    const newRecord: AttendanceRecord = {
      id: newId,
      name: newStaff.name,
      role: newStaff.role,
      date: selectedDate,
      checkIn: newStaff.status === "Absent" ? "-" : newStaff.checkIn,
      checkOut: newStaff.status === "Absent" ? "-" : newStaff.checkOut,
      status: newStaff.status,
      hours,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const newData = [...attendanceData, newRecord]
    await saveAttendanceData(newData)

    setNewStaff({ name: "", role: "", checkIn: "", checkOut: "", status: "Present" })
    setIsAddDialogOpen(false)
  }

  // Generate analytics data for the last 7 days
  const getWeeklyAnalytics = async () => {
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
        late: dayData.filter((r) => r.status === "Late").length,
        halfDay: dayData.filter((r) => r.status === "Half Day").length,
      })
    }
    return data
  }

  const [weeklyData, setWeeklyData] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading) {
      getWeeklyAnalytics().then(setWeeklyData)
    }
  }, [isLoading, selectedDate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading attendance data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
            </div>
            <p className="text-gray-600">Track and manage staff attendance with historical data and analytics</p>
          </div>

          {/* Date Selection and Analytics Toggle */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <Label htmlFor="date-select" className="text-sm font-medium text-gray-700">
                        Select Date
                      </Label>
                      <Input
                        id="date-select"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mt-1 w-full sm:w-auto"
                      />
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-600">Viewing attendance for</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Analytics View</p>
                      <p className="text-xs text-gray-500">Toggle weekly attendance charts</p>
                    </div>
                  </div>
                  <Button
                    variant={showAnalytics ? "default" : "outline"}
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {showAnalytics ? "Hide" : "Show"} Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          {showAnalytics && (
            <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Weekly Attendance Analytics
                </CardTitle>
                <CardDescription className="text-purple-100">Attendance trends for the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ChartContainer
                  config={{
                    present: {
                      label: "Present",
                      color: "hsl(var(--chart-1))",
                    },
                    absent: {
                      label: "Absent",
                      color: "hsl(var(--chart-2))",
                    },
                    late: {
                      label: "Late",
                      color: "hsl(var(--chart-3))",
                    },
                    halfDay: {
                      label: "Half Day",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="present" fill="var(--color-present)" name="Present" />
                      <Bar dataKey="absent" fill="var(--color-absent)" name="Absent" />
                      <Bar dataKey="late" fill="var(--color-late)" name="Late" />
                      <Bar dataKey="halfDay" fill="var(--color-halfDay)" name="Half Day" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-blue-100">Total Staff</CardTitle>
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-200" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{attendanceData.length}</div>
                <p className="text-xs text-blue-100 mt-1">For selected date</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-emerald-100">Present</CardTitle>
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-200" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{presentCount}</div>
                <p className="text-xs text-emerald-100 mt-1">On time arrival</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-red-100">Absent</CardTitle>
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-red-200" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{absentCount}</div>
                <p className="text-xs text-red-100 mt-1">Not present</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-amber-100">Late/Half Day</CardTitle>
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-200" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{halfDayCount + lateCount}</div>
                <p className="text-xs text-amber-100 mt-1">Partial attendance</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Attendance Table */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="flex flex-col space-y-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                    Staff Attendance - {new Date(selectedDate).toLocaleDateString()}
                  </CardTitle>
                  <CardDescription className="text-blue-100 mt-1 text-sm">
                    Click edit to modify attendance records or add new staff
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/90"
                    />
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-white w-full sm:w-auto">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Staff
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5 text-blue-600" />
                          Add New Staff Member
                        </DialogTitle>
                        <DialogDescription>
                          Add a new staff member to {new Date(selectedDate).toLocaleDateString()} attendance record.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="staffName">Staff Name</Label>
                          <Input
                            id="staffName"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="staffRole">Role</Label>
                          <Select onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Radiologist">Radiologist</SelectItem>
                              <SelectItem value="Technician">Technician</SelectItem>
                              <SelectItem value="Nurse">Nurse</SelectItem>
                              <SelectItem value="Receptionist">Receptionist</SelectItem>
                              <SelectItem value="Security Guard">Security Guard</SelectItem>
                              <SelectItem value="Cleaner">Cleaner</SelectItem>
                              <SelectItem value="Administrator">Administrator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select onValueChange={(value: any) => setNewStaff({ ...newStaff, status: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Present">Present</SelectItem>
                              <SelectItem value="Absent">Absent</SelectItem>
                              <SelectItem value="Half Day">Half Day</SelectItem>
                              <SelectItem value="Late">Late</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newStaff.status !== "Absent" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="checkIn">Check In</Label>
                              <Input
                                id="checkIn"
                                type="time"
                                value={newStaff.checkIn}
                                onChange={(e) => setNewStaff({ ...newStaff, checkIn: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="checkOut">Check Out</Label>
                              <Input
                                id="checkOut"
                                type="time"
                                value={newStaff.checkOut}
                                onChange={(e) => setNewStaff({ ...newStaff, checkOut: e.target.value })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addNewStaff} disabled={!newStaff.name || !newStaff.role}>
                          Add Staff Member
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Staff Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Check In</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Check Out</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Hours</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((record, index) => (
                      <tr
                        key={record.id}
                        className={cn(
                          "border-b transition-colors hover:bg-blue-50/50",
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                        )}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {record.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div className="font-medium text-gray-900">{record.name}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{record.role}</td>
                        <td className="py-4 px-6">
                          {record.isEditing ? (
                            <Input
                              type="time"
                              value={record.checkIn === "-" ? "" : record.checkIn}
                              onChange={(e) => updateRecord(record.id, "checkIn", e.target.value || "-")}
                              className="w-32"
                            />
                          ) : (
                            <span className="text-gray-600">{record.checkIn}</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {record.isEditing ? (
                            <Input
                              type="time"
                              value={record.checkOut === "-" ? "" : record.checkOut}
                              onChange={(e) => updateRecord(record.id, "checkOut", e.target.value || "-")}
                              className="w-32"
                            />
                          ) : (
                            <span className="text-gray-600">{record.checkOut}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-gray-600 font-medium">{record.hours}</td>
                        <td className="py-4 px-6">
                          {record.isEditing ? (
                            <Select
                              value={record.status}
                              onValueChange={(value: any) => updateRecord(record.id, "status", value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                                <SelectItem value="Half Day">Half Day</SelectItem>
                                <SelectItem value="Late">Late</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            getStatusBadge(record.status)
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {record.isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveRecord(record.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => toggleEdit(record.id)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleEdit(record.id)}
                                  className="hover:bg-blue-50"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteRecord(record.id)}
                                  className="hover:bg-red-50 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-4">
                {filteredData.map((record, index) => (
                  <Card key={record.id} className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {record.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{record.name}</div>
                            <div className="text-sm text-gray-600">{record.role}</div>
                          </div>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Check In:</span>
                          {record.isEditing ? (
                            <Input
                              type="time"
                              value={record.checkIn === "-" ? "" : record.checkIn}
                              onChange={(e) => updateRecord(record.id, "checkIn", e.target.value || "-")}
                              className="mt-1"
                            />
                          ) : (
                            <div className="font-medium">{record.checkIn}</div>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Check Out:</span>
                          {record.isEditing ? (
                            <Input
                              type="time"
                              value={record.checkOut === "-" ? "" : record.checkOut}
                              onChange={(e) => updateRecord(record.id, "checkOut", e.target.value || "-")}
                              className="mt-1"
                            />
                          ) : (
                            <div className="font-medium">{record.checkOut}</div>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Hours:</span>
                          <div className="font-medium">{record.hours}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          {record.isEditing ? (
                            <Select
                              value={record.status}
                              onValueChange={(value: any) => updateRecord(record.id, "status", value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                                <SelectItem value="Half Day">Half Day</SelectItem>
                                <SelectItem value="Late">Late</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="mt-1">{getStatusBadge(record.status)}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        {record.isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveRecord(record.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => toggleEdit(record.id)}>
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleEdit(record.id)}
                              className="hover:bg-blue-50"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteRecord(record.id)}
                              className="hover:bg-red-50 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
