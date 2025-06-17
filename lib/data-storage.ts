import { supabase } from "./supabase-client"


// Keep existing interfaces
export interface AttendanceRecord {
  id: number
  name: string
  role: string
  date: string
  checkIn: string
  checkOut: string
  status: "Present" | "Absent" | "Half Day" | "Late"
  hours: string
  createdAt: string
  updatedAt: string
  isEditing?: boolean
}

export interface InventoryRecord {
  id: number
  name: string
  category: string
  quantity: number
  minStock: number
  unit: string
  status: string
  lastUpdated: string
  history?: InventoryHistoryEntry[]
}

export interface InventoryHistoryEntry {
  date: string
  action: "added" | "removed" | "updated"
  quantity: number
  previousQuantity?: number
  reason: string
  updatedBy: string
}

export interface AttendanceAnalytics {
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  halfDays: number
  attendanceRate: number
}

// Attendance Data Management with Supabase
export class AttendanceDataManager {
  private static STORAGE_KEY = "radiology_attendance_data"

  static async saveAttendanceData(date: string, data: AttendanceRecord[]): Promise<void> {
    try {
      // Delete existing records for this date
      await supabase.from("attendance").delete().eq("date", date)

      // Insert new records if any
      if (data.length > 0) {
        const supabaseData = data.map((record) => ({
          name: record.name,
          role: record.role,
          date: record.date,
          check_in: record.checkIn === "-" ? null : record.checkIn,
          check_out: record.checkOut === "-" ? null : record.checkOut,
          status: record.status,
          hours: record.hours,
          created_at: record.createdAt,
          updated_at: new Date().toISOString(),
        }))

        const { error } = await supabase.from("attendance").insert(supabaseData)

        if (error) {
          console.error("Supabase insert failed:")
          console.error("Message:", error.message)
          console.error("Details:", error.details)
          console.error("Hint:", error.hint)
          console.error("Code:", error.code)
          throw error
        }
        
      }
    } catch (error) {
      console.error("Error saving attendance data to Supabase:", error)
      // Fallback to localStorage
      try {
        const existingData = this.getAllAttendanceDataLocal()
        existingData[date] = data
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData))
      } catch (localError) {
        console.error("Fallback to localStorage also failed:", localError)
      }
    }
  }

  static async getAttendanceData(date: string): Promise<AttendanceRecord[]> {
    try {
      const { data, error } = await supabase.from("attendance").select("*").eq("date", date).order("name")

      if (error) throw error

      return (data || []).map((record) => ({
        id: record.id,
        name: record.name,
        role: record.role,
        date: record.date,
        checkIn: record.check_in || "-",
        checkOut: record.check_out || "-",
        status: record.status,
        hours: record.hours,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
      }))
    } catch (error) {
      console.error("Error loading attendance data from Supabase:", error)
      // Fallback to localStorage
      return this.getAttendanceDataLocal(date)
    }
  }

  static async getAllAttendanceData(): Promise<Record<string, AttendanceRecord[]>> {
    try {
      const { data, error } = await supabase.from("attendance").select("*").order("date", { ascending: false })

      if (error) throw error

      const groupedData: Record<string, AttendanceRecord[]> = {}

      data?.forEach((record) => {
        if (!groupedData[record.date]) {
          groupedData[record.date] = []
        }
        groupedData[record.date].push({
          id: record.id,
          name: record.name,
          role: record.role,
          date: record.date,
          checkIn: record.check_in || "-",
          checkOut: record.check_out || "-",
          status: record.status,
          hours: record.hours,
          createdAt: record.created_at,
          updatedAt: record.updated_at,
        })
      })

      return groupedData
    } catch (error) {
      console.error("Error loading all attendance data from Supabase:", error)
      // Fallback to localStorage
      return this.getAllAttendanceDataLocal()
    }
  }

  // Fallback localStorage methods
  private static getAllAttendanceDataLocal(): Record<string, AttendanceRecord[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      return {}
    }
  }

  private static getAttendanceDataLocal(date: string): AttendanceRecord[] {
    const allData = this.getAllAttendanceDataLocal()
    return allData[date] || []
  }

  static async getAttendanceAnalytics(
    staffName: string,
    startDate: string,
    endDate: string,
  ): Promise<AttendanceAnalytics> {
    const allData = await this.getAllAttendanceData()
    let totalDays = 0
    let presentDays = 0
    let absentDays = 0
    let lateDays = 0
    let halfDays = 0

    Object.entries(allData).forEach(([date, records]) => {
      if (date >= startDate && date <= endDate) {
        const staffRecord = records.find((r) => r.name === staffName)
        if (staffRecord) {
          totalDays++
          switch (staffRecord.status) {
            case "Present":
              presentDays++
              break
            case "Absent":
              absentDays++
              break
            case "Late":
              lateDays++
              break
            case "Half Day":
              halfDays++
              break
          }
        }
      }
    })

    return {
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      halfDays,
      attendanceRate: totalDays > 0 ? ((presentDays + lateDays + halfDays) / totalDays) * 100 : 0,
    }
  }

  static async getMonthlyAttendanceStats(month: string): Promise<Record<string, number>> {
    const allData = await this.getAllAttendanceData()
    const stats = { present: 0, absent: 0, late: 0, halfDay: 0 }

    Object.entries(allData).forEach(([date, records]) => {
      if (date.startsWith(month)) {
        records.forEach((record) => {
          switch (record.status) {
            case "Present":
              stats.present++
              break
            case "Absent":
              stats.absent++
              break
            case "Late":
              stats.late++
              break
            case "Half Day":
              stats.halfDay++
              break
          }
        })
      }
    })

    return stats
  }
}

// Inventory Data Management with Supabase
export class InventoryDataManager {
  private static STORAGE_KEY = "radiology_inventory_data"

  static async saveInventoryData(data: InventoryRecord[]): Promise<void> {
    try {
      // Clear existing data
      await supabase.from("inventory").delete().neq("id", 0)

      // Insert new data
      if (data.length > 0) {
        const supabaseData = data.map((item) => ({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          min_stock: item.minStock,
          unit: item.unit,
          status: item.status,
          last_updated: item.lastUpdated,
        }))

        const { error } = await supabase.from("inventory").insert(supabaseData)
        if (error) throw error
      }
    } catch (error) {
      console.error("Error saving inventory data to Supabase:", error)
      // Fallback to localStorage
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
      } catch (localError) {
        console.error("Fallback to localStorage also failed:", localError)
      }
    }
  }

  static async getInventoryData(): Promise<InventoryRecord[]> {
    try {
      const { data: inventoryData, error: inventoryError } = await supabase.from("inventory").select("*").order("id")

      if (inventoryError) throw inventoryError

      // If no data exists, initialize with default data
      if (!inventoryData || inventoryData.length === 0) {
        const defaultData = this.getDefaultInventoryData()
        await this.saveInventoryData(defaultData)
        return defaultData
      }

      // Get history for each item
      const { data: historyData, error: historyError } = await supabase
        .from("inventory_history")
        .select("*")
        .order("created_at", { ascending: false })

      if (historyError) {
        console.error("Error loading inventory history:", historyError)
      }

      return inventoryData.map((item) => {
        const itemHistory = (historyData || [])
          .filter((h) => h.inventory_id === item.id)
          .map((h) => ({
            date: h.created_at,
            action: h.action,
            quantity: h.quantity,
            previousQuantity: h.previous_quantity,
            reason: h.reason,
            updatedBy: h.updated_by,
          }))

        return {
          id: item.id,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          minStock: item.min_stock,
          unit: item.unit,
          status: item.status,
          lastUpdated: item.last_updated,
          history: itemHistory,
        }
      })
    } catch (error) {
      console.error("Error loading inventory data from Supabase:", error)
      // Fallback to localStorage
      return this.getInventoryDataLocal()
    }
  }

  static async updateInventoryItem(
    id: number,
    updates: Partial<InventoryRecord>,
    reason: string,
    updatedBy: string,
  ): Promise<void> {
    try {
      // Get current item data
      const { data: currentItem, error: fetchError } = await supabase
        .from("inventory")
        .select("*")
        .eq("id", id)
        .single()

      if (fetchError) throw fetchError

      const previousQuantity = currentItem.quantity

      // Prepare update data
      const updateData: any = {
        last_updated: new Date().toISOString(),
      }

      if (updates.name) updateData.name = updates.name
      if (updates.category) updateData.category = updates.category
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity
      if (updates.minStock !== undefined) updateData.min_stock = updates.minStock
      if (updates.unit) updateData.unit = updates.unit

      // Update status based on quantity
      if (updates.quantity !== undefined && updates.minStock !== undefined) {
        updateData.status = updates.quantity <= updates.minStock ? "Low Stock" : "In Stock"
      } else if (updates.quantity !== undefined) {
        updateData.status = updates.quantity <= currentItem.min_stock ? "Low Stock" : "In Stock"
      }

      // Update the item
      const { error: updateError } = await supabase.from("inventory").update(updateData).eq("id", id)

      if (updateError) throw updateError

      // Add history entry if quantity changed
      if (updates.quantity !== undefined && updates.quantity !== previousQuantity) {
        const { error: historyError } = await supabase.from("inventory_history").insert({
          inventory_id: id,
          action: updates.quantity > previousQuantity ? "added" : "removed",
          quantity: Math.abs(updates.quantity - previousQuantity),
          previous_quantity: previousQuantity,
          reason,
          updated_by: updatedBy,
        })

        if (historyError) {
          console.error("Error adding inventory history:", historyError)
        }
      }
    } catch (error) {
      console.error("Error updating inventory item in Supabase:", error)
      // Fallback to localStorage
      const data = this.getInventoryDataLocal()
      const itemIndex = data.findIndex((item) => item.id === id)

      if (itemIndex >= 0) {
        const item = data[itemIndex]
        const previousQuantity = item.quantity

        Object.assign(item, updates, {
          lastUpdated: new Date().toISOString(),
          status:
            updates.quantity && updates.minStock
              ? updates.quantity <= updates.minStock
                ? "Low Stock"
                : "In Stock"
              : item.status,
        })

        if (updates.quantity !== undefined && updates.quantity !== previousQuantity) {
          if (!item.history) item.history = []
          item.history.push({
            date: new Date().toISOString(),
            action: updates.quantity > previousQuantity ? "added" : "removed",
            quantity: Math.abs(updates.quantity - previousQuantity),
            previousQuantity,
            reason,
            updatedBy,
          })
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
      }
    }
  }

  static async addInventoryItem(item: Omit<InventoryRecord, "id" | "lastUpdated" | "history">): Promise<void> {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .insert({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          min_stock: item.minStock,
          unit: item.unit,
          status: item.status,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Add initial history entry
      await supabase.from("inventory_history").insert({
        inventory_id: data.id,
        action: "added",
        quantity: item.quantity,
        reason: "Initial stock",
        updated_by: "Admin",
      })
    } catch (error) {
      console.error("Error adding inventory item to Supabase:", error)
      // Fallback to localStorage
      const data = this.getInventoryDataLocal()
      const newId = Math.max(...data.map((i) => i.id), 0) + 1

      const newItem: InventoryRecord = {
        ...item,
        id: newId,
        lastUpdated: new Date().toISOString(),
        history: [
          {
            date: new Date().toISOString(),
            action: "added",
            quantity: item.quantity,
            reason: "Initial stock",
            updatedBy: "Admin",
          },
        ],
      }

      data.push(newItem)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    }
  }

  static async getInventoryHistory(startDate: string, endDate: string): Promise<InventoryHistoryEntry[]> {
    try {
      const { data, error } = await supabase
        .from("inventory_history")
        .select("*")
        .gte("created_at", startDate)
        .lte("created_at", endDate + "T23:59:59")
        .order("created_at", { ascending: false })

      if (error) throw error

      return (data || []).map((entry) => ({
        date: entry.created_at,
        action: entry.action,
        quantity: entry.quantity,
        previousQuantity: entry.previous_quantity,
        reason: entry.reason,
        updatedBy: entry.updated_by,
      }))
    } catch (error) {
      console.error("Error loading inventory history from Supabase:", error)
      // Fallback to localStorage
      const data = this.getInventoryDataLocal()
      const history: InventoryHistoryEntry[] = []

      data.forEach((item) => {
        if (item.history) {
          item.history.forEach((entry) => {
            const entryDate = entry.date.split("T")[0]
            if (entryDate >= startDate && entryDate <= endDate) {
              history.push(entry)
            }
          })
        }
      })

      return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }

  // Fallback localStorage methods
  private static getInventoryDataLocal(): InventoryRecord[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : this.getDefaultInventoryData()
    } catch (error) {
      return this.getDefaultInventoryData()
    }
  }

  private static getDefaultInventoryData(): InventoryRecord[] {
    return [
      {
        id: 1,
        name: "Contrast Dye",
        category: "Medical Supplies",
        quantity: 5,
        minStock: 20,
        unit: "Bottles",
        status: "Low Stock",
        lastUpdated: new Date().toISOString(),
        history: [
          {
            date: new Date().toISOString(),
            action: "added",
            quantity: 5,
            reason: "Initial stock",
            updatedBy: "Admin",
          },
        ],
      },
      {
        id: 2,
        name: "X-Ray Films",
        category: "Imaging Supplies",
        quantity: 15,
        minStock: 50,
        unit: "Boxes",
        status: "Low Stock",
        lastUpdated: new Date().toISOString(),
        history: [
          {
            date: new Date().toISOString(),
            action: "added",
            quantity: 15,
            reason: "Initial stock",
            updatedBy: "Admin",
          },
        ],
      },
      {
        id: 3,
        name: "Ultrasound Gel",
        category: "Medical Supplies",
        quantity: 8,
        minStock: 25,
        unit: "Tubes",
        status: "Low Stock",
        lastUpdated: new Date().toISOString(),
        history: [
          {
            date: new Date().toISOString(),
            action: "added",
            quantity: 8,
            reason: "Initial stock",
            updatedBy: "Admin",
          },
        ],
      },
      {
        id: 4,
        name: "Disposable Gloves",
        category: "Safety Equipment",
        quantity: 45,
        minStock: 100,
        unit: "Boxes",
        status: "Low Stock",
        lastUpdated: new Date().toISOString(),
        history: [
          {
            date: new Date().toISOString(),
            action: "added",
            quantity: 45,
            reason: "Initial stock",
            updatedBy: "Admin",
          },
        ],
      },
      {
        id: 5,
        name: "Lead Aprons",
        category: "Safety Equipment",
        quantity: 8,
        minStock: 15,
        unit: "Units",
        status: "Low Stock",
        lastUpdated: new Date().toISOString(),
        history: [
          {
            date: new Date().toISOString(),
            action: "added",
            quantity: 8,
            reason: "Initial stock",
            updatedBy: "Admin",
          },
        ],
      },
    ]
  }
}

// Initialize default data - now async and uses Supabase
export const initializeDefaultData = async () => {
  try {
    const currentDate = new Date().toISOString().split("T")[0]

    // Check if attendance data exists for today
    const attendanceData = await AttendanceDataManager.getAttendanceData(currentDate)
    if (attendanceData.length === 0) {
      const defaultAttendance: AttendanceRecord[] = [
        {
          id: 1,
          name: "Dr. Bhajan Singh",
          role: "Chief Radiologist",
          date: currentDate,
          checkIn: "08:00",
          checkOut: "18:00",
          status: "Present",
          hours: "10h",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Dr. Priya Sharma",
          role: "Senior Radiologist",
          date: currentDate,
          checkIn: "08:30",
          checkOut: "17:30",
          status: "Present",
          hours: "9h",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Rajesh Kumar",
          role: "Chief Technologist",
          date: currentDate,
          checkIn: "07:45",
          checkOut: "16:45",
          status: "Present",
          hours: "9h",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 4,
          name: "Sunita Patel",
          role: "MRI Technician",
          date: currentDate,
          checkIn: "09:15",
          checkOut: "18:15",
          status: "Late",
          hours: "9h",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 5,
          name: "Amit Verma",
          role: "CT Technician",
          date: currentDate,
          checkIn: "-",
          checkOut: "-",
          status: "Absent",
          hours: "0h",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 6,
          name: "Neha Gupta",
          role: "Ultrasound Technician",
          date: currentDate,
          checkIn: "08:15",
          checkOut: "17:15",
          status: "Present",
          hours: "9h",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      await AttendanceDataManager.saveAttendanceData(currentDate, defaultAttendance)
    }

    // Initialize inventory data
    await InventoryDataManager.getInventoryData()
  } catch (error) {
    console.error("Error initializing default data:", error)
  }
}
