"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ExportManager } from "@/lib/export-manager"

const exportData = (format: "excel" | "pdf", type: "attendance" | "inventory") => {
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const endDate = new Date().toISOString().split("T")[0]

  if (type === "attendance") {
    if (format === "excel") {
      ExportManager.exportAttendanceToExcel(startDate, endDate)
    } else {
      ExportManager.exportAttendanceToPDF(startDate, endDate)
    }
  } else {
    if (format === "excel") {
      ExportManager.exportInventoryToExcel()
    } else {
      ExportManager.exportInventoryToPDF()
    }
  }
}

const DataManagementPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Data Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Data Export */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Data</CardTitle>
            <CardDescription>Export attendance records.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Label>Export Format:</Label>
              <div className="flex space-x-2">
                <Button onClick={() => exportData("excel", "attendance")} variant="outline">
                  Excel
                </Button>
                <Button onClick={() => exportData("pdf", "attendance")} variant="outline">
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Data Export */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Data</CardTitle>
            <CardDescription>Export inventory records.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Label>Export Format:</Label>
              <div className="flex space-x-2">
                <Button onClick={() => exportData("excel", "inventory")} variant="outline">
                  Excel
                </Button>
                <Button onClick={() => exportData("pdf", "inventory")} variant="outline">
                  PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add more data management options here */}
      </div>
    </div>
  )
}

export default DataManagementPage
