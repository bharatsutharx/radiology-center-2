// lib/export-manager.ts

import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Dummy attendance data (replace with real later)
const dummyAttendanceData = [
  { name: "John", date: "2024-06-01", status: "Present" },
  { name: "Jane", date: "2024-06-02", status: "Absent" }
]

// Dummy inventory data
const dummyInventoryData = [
  { item: "X-Ray Film", quantity: 50 },
  { item: "Syringe", quantity: 200 }
]

export const ExportManager = {
  exportAttendanceToExcel: (startDate: string, endDate: string) => {
    const worksheet = XLSX.utils.json_to_sheet(dummyAttendanceData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance")
    XLSX.writeFile(workbook, `attendance_${startDate}_to_${endDate}.xlsx`)
  },

  exportAttendanceToPDF: (startDate: string, endDate: string) => {
    const doc = new jsPDF()
    doc.text(`Attendance Report (${startDate} to ${endDate})`, 10, 10)
    autoTable(doc, {
      startY: 20,
      head: [["Name", "Date", "Status"]],
      body: dummyAttendanceData.map(row => [row.name, row.date, row.status])
    })
    doc.save(`attendance_${startDate}_to_${endDate}.pdf`)
  },

  exportInventoryToExcel: () => {
    const worksheet = XLSX.utils.json_to_sheet(dummyInventoryData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory")
    XLSX.writeFile(workbook, "inventory.xlsx")
  },

  exportInventoryToPDF: () => {
    const doc = new jsPDF()
    doc.text("Inventory Report", 10, 10)
    autoTable(doc, {
      startY: 20,
      head: [["Item", "Quantity"]],
      body: dummyInventoryData.map(row => [row.item, row.quantity])
    })
    doc.save("inventory.pdf")
  }
}
