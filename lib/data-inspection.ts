// Data Inspection and Management Utilities

export class DataInspector {
  // View all stored data
  static inspectAllData() {
    console.log("=== RADIOLOGY CENTER DATA INSPECTION ===")

    // Attendance Data
    const attendanceData = localStorage.getItem("radiology_attendance_data")
    console.log("📅 ATTENDANCE DATA:")
    if (attendanceData) {
      const parsed = JSON.parse(attendanceData)
      console.log("Structure:", Object.keys(parsed))
      console.log("Sample:", parsed)
    } else {
      console.log("No attendance data found")
    }

    // Inventory Data
    const inventoryData = localStorage.getItem("radiology_inventory_data")
    console.log("\n📦 INVENTORY DATA:")
    if (inventoryData) {
      const parsed = JSON.parse(inventoryData)
      console.log("Items count:", parsed.length)
      console.log("Sample item:", parsed[0])
    } else {
      console.log("No inventory data found")
    }

    return {
      attendance: attendanceData ? JSON.parse(attendanceData) : null,
      inventory: inventoryData ? JSON.parse(inventoryData) : null,
    }
  }

  // Get data size
  static getDataSize() {
    const attendanceSize = localStorage.getItem("radiology_attendance_data")?.length || 0
    const inventorySize = localStorage.getItem("radiology_inventory_data")?.length || 0

    return {
      attendance: `${(attendanceSize / 1024).toFixed(2)} KB`,
      inventory: `${(inventorySize / 1024).toFixed(2)} KB`,
      total: `${((attendanceSize + inventorySize) / 1024).toFixed(2)} KB`,
    }
  }

  // Export all data to file
  static exportAllData() {
    const allData = {
      exportDate: new Date().toISOString(),
      attendance: localStorage.getItem("radiology_attendance_data"),
      inventory: localStorage.getItem("radiology_inventory_data"),
      metadata: {
        browser: navigator.userAgent,
        timestamp: Date.now(),
        version: "1.0",
      },
    }

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `radiology-center-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Import data from file
  static importData(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)

          if (data.attendance) {
            localStorage.setItem("radiology_attendance_data", data.attendance)
          }
          if (data.inventory) {
            localStorage.setItem("radiology_inventory_data", data.inventory)
          }

          resolve(true)
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsText(file)
    })
  }

  // Clear all data
  static clearAllData() {
    localStorage.removeItem("radiology_attendance_data")
    localStorage.removeItem("radiology_inventory_data")
    console.log("All radiology center data cleared!")
  }

  // Get storage usage
  static getStorageUsage() {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length
      }
    }

    return {
      totalUsed: `${(total / 1024).toFixed(2)} KB`,
      radiologyData: this.getDataSize(),
      availableSpace: "~5-10 MB (browser dependent)",
    }
  }
}

// Example data structures
export const EXAMPLE_DATA_STRUCTURES = {
  attendance: {
    "2024-01-15": [
      {
        id: 1,
        name: "Dr. Bhajan Singh",
        role: "Chief Radiologist",
        date: "2024-01-15",
        checkIn: "08:00",
        checkOut: "18:00",
        status: "Present",
        hours: "10h",
        createdAt: "2024-01-15T08:00:00.000Z",
        updatedAt: "2024-01-15T18:00:00.000Z",
      },
    ],
    "2024-01-16": [
      // More attendance records...
    ],
  },

  inventory: [
    {
      id: 1,
      name: "Contrast Dye",
      category: "Medical Supplies",
      quantity: 15,
      minStock: 20,
      unit: "Bottles",
      status: "Low Stock",
      lastUpdated: "2024-01-15T10:30:00.000Z",
      history: [
        {
          date: "2024-01-15T10:30:00.000Z",
          action: "added",
          quantity: 5,
          previousQuantity: 10,
          reason: "New shipment received",
          updatedBy: "Admin",
        },
        {
          date: "2024-01-14T14:20:00.000Z",
          action: "removed",
          quantity: 3,
          previousQuantity: 13,
          reason: "Used for patient procedures",
          updatedBy: "Dr. Sharma",
        },
      ],
    },
  ],
}
