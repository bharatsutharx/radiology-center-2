import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { AttendanceDataManager, InventoryDataManager } from "./data-storage"

export class ExportManager {
  // Export attendance data to Excel
  static exportAttendanceToExcel(startDate: string, endDate: string) {
    const allData = AttendanceDataManager.getAllAttendanceData()
    const exportData: any[] = []

    Object.entries(allData).forEach(([date, records]) => {
      if (date >= startDate && date <= endDate) {
        records.forEach((record) => {
          exportData.push({
            Date: date,
            "Staff Name": record.name,
            Role: record.role,
            "Check In": record.checkIn,
            "Check Out": record.checkOut,
            "Hours Worked": record.hours,
            Status: record.status,
            "Last Updated": new Date(record.updatedAt).toLocaleString(),
          })
        })
      }
    })

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Report")

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }))
    ws["!cols"] = colWidths

    // Use browser-compatible write method
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    this.saveArrayBuffer(wbout, `attendance-report-${startDate}-to-${endDate}.xlsx`)
  }

  // Export inventory data to Excel
  static exportInventoryToExcel() {
    const data = InventoryDataManager.getInventoryData()
    const exportData = data.map((item) => ({
      "Item Name": item.name,
      Category: item.category,
      "Current Quantity": item.quantity,
      "Minimum Stock": item.minStock,
      Unit: item.unit,
      Status: item.status,
      "Last Updated": new Date(item.lastUpdated).toLocaleString(),
      "History Count": item.history.length,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Report")

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }))
    ws["!cols"] = colWidths

    // Use browser-compatible write method
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    this.saveArrayBuffer(wbout, `inventory-report-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  // Export staff performance to Excel
  static exportStaffPerformanceToExcel(staffName: string, startDate: string, endDate: string) {
    const allData = AttendanceDataManager.getAllAttendanceData()
    const staffData: any[] = []

    Object.entries(allData).forEach(([date, records]) => {
      if (date >= startDate && date <= endDate) {
        const staffRecord = records.find((r) => r.name === staffName)
        if (staffRecord) {
          staffData.push({
            Date: date,
            "Day of Week": new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
            "Check In": staffRecord.checkIn,
            "Check Out": staffRecord.checkOut,
            "Hours Worked": staffRecord.hours,
            Status: staffRecord.status,
            "Late Minutes": staffRecord.status === "Late" ? this.calculateLateMinutes(staffRecord.checkIn) : 0,
          })
        } else {
          staffData.push({
            Date: date,
            "Day of Week": new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
            "Check In": "-",
            "Check Out": "-",
            "Hours Worked": "0h",
            Status: "Absent",
            "Late Minutes": 0,
          })
        }
      }
    })

    const ws = XLSX.utils.json_to_sheet(staffData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `${staffName} Performance`)

    // Auto-size columns
    const colWidths = Object.keys(staffData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }))
    ws["!cols"] = colWidths

    // Use browser-compatible write method
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    this.saveArrayBuffer(wbout, `${staffName.replace(/\s+/g, "-")}-performance-${startDate}-to-${endDate}.xlsx`)
  }

  // Export attendance data to PDF
  static exportAttendanceToPDF(startDate: string, endDate: string) {
    const doc = new jsPDF()
    const allData = AttendanceDataManager.getAllAttendanceData()
    const exportData: any[] = []

    Object.entries(allData).forEach(([date, records]) => {
      if (date >= startDate && date <= endDate) {
        records.forEach((record) => {
          exportData.push([
            date,
            record.name,
            record.role,
            record.checkIn,
            record.checkOut,
            record.hours,
            record.status,
          ])
        })
      }
    })

    // Add title
    doc.setFontSize(20)
    doc.text("Dr. Bhajan Radiology Center", 20, 20)
    doc.setFontSize(16)
    doc.text("Attendance Report", 20, 30)
    doc.setFontSize(12)
    doc.text(`Period: ${startDate} to ${endDate}`, 20, 40)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50)

    // Add table
    ;(doc as any).autoTable({
      head: [["Date", "Staff Name", "Role", "Check In", "Check Out", "Hours", "Status"]],
      body: exportData,
      startY: 60,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    })

    doc.save(`attendance-report-${startDate}-to-${endDate}.pdf`)
  }

  // Export inventory data to PDF
  static exportInventoryToPDF() {
    const doc = new jsPDF()
    const data = InventoryDataManager.getInventoryData()
    const exportData = data.map((item) => [
      item.name,
      item.category,
      item.quantity.toString(),
      item.minStock.toString(),
      item.unit,
      item.status,
    ])

    // Add title
    doc.setFontSize(20)
    doc.text("Dr. Bhajan Radiology Center", 20, 20)
    doc.setFontSize(16)
    doc.text("Inventory Report", 20, 30)
    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 40)

    // Add table
    ;(doc as any).autoTable({
      head: [["Item Name", "Category", "Quantity", "Min Stock", "Unit", "Status"]],
      body: exportData,
      startY: 50,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [147, 51, 234] },
    })

    doc.save(`inventory-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  // Export staff performance to PDF
  static exportStaffPerformanceToPDF(staffName: string, startDate: string, endDate: string) {
    const doc = new jsPDF()
    const allData = AttendanceDataManager.getAllAttendanceData()
    const staffData: any[] = []

    Object.entries(allData).forEach(([date, records]) => {
      if (date >= startDate && date <= endDate) {
        const staffRecord = records.find((r) => r.name === staffName)
        if (staffRecord) {
          staffData.push([
            date,
            new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
            staffRecord.checkIn,
            staffRecord.checkOut,
            staffRecord.hours,
            staffRecord.status,
          ])
        } else {
          staffData.push([
            date,
            new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
            "-",
            "-",
            "0h",
            "Absent",
          ])
        }
      }
    })

    // Add title
    doc.setFontSize(20)
    doc.text("Dr. Bhajan Radiology Center", 20, 20)
    doc.setFontSize(16)
    doc.text(`${staffName} - Performance Report`, 20, 30)
    doc.setFontSize(12)
    doc.text(`Period: ${startDate} to ${endDate}`, 20, 40)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50)

    // Add table
    ;(doc as any).autoTable({
      head: [["Date", "Day", "Check In", "Check Out", "Hours", "Status"]],
      body: staffData,
      startY: 60,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [147, 51, 234] },
    })

    doc.save(`${staffName.replace(/\s+/g, "-")}-performance-${startDate}-to-${endDate}.pdf`)
  }

  // Browser-compatible file save method
  private static saveArrayBuffer(buffer: any, fileName: string) {
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  private static calculateLateMinutes(checkIn: string): number {
    if (checkIn === "-") return 0
    const [hours, minutes] = checkIn.split(":").map(Number)
    const checkInTime = hours * 60 + minutes
    const standardTime = 8 * 60 // 8:00 AM
    return Math.max(0, checkInTime - standardTime)
  }
}
