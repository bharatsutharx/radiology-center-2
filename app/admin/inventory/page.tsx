"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Package, Plus, Minus, Search, AlertTriangle, History, BarChart3 } from "lucide-react"
import {
  type InventoryRecord,
  InventoryDataManager,
  type InventoryHistoryEntry,
  initializeDefaultData,
} from "@/lib/data-storage"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function InventoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryRecord | null>(null)
  const [updateQuantity, setUpdateQuantity] = useState("")
  const [updateReason, setUpdateReason] = useState("")
  const [updateAction, setUpdateAction] = useState<"add" | "remove">("add")
  const [inventoryHistory, setInventoryHistory] = useState<InventoryHistoryEntry[]>([])
  const [historyDateRange, setHistoryDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    end: new Date().toISOString().split("T")[0], // today
  })
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    minStock: "",
    unit: "",
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    } else {
      initializeDefaultData()
      loadInventoryData()
    }
  }, [router])

  const [inventoryData, setInventoryData] = useState<InventoryRecord[]>([])

  const loadInventoryData = () => {
    const data = InventoryDataManager.getInventoryData()
    setInventoryData(data)
  }

  const loadInventoryHistory = () => {
    const history = InventoryDataManager.getInventoryHistory(historyDateRange.start, historyDateRange.end)
    setInventoryHistory(history)
  }

  useEffect(() => {
    if (isHistoryDialogOpen) {
      loadInventoryHistory()
    }
  }, [isHistoryDialogOpen, historyDateRange])

  const filteredData = inventoryData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalItems = inventoryData.length
  const lowStockItems = inventoryData.filter((item) => item.quantity <= item.minStock).length
  const inStockItems = inventoryData.filter((item) => item.quantity > item.minStock).length

  const getStatusBadge = (item: InventoryRecord) => {
    if (item.quantity <= item.minStock) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Low Stock</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
  }

  const handleAddItem = () => {
    const quantity = Number.parseInt(newItem.quantity)
    const minStock = Number.parseInt(newItem.minStock)

    InventoryDataManager.addInventoryItem({
      name: newItem.name,
      category: newItem.category,
      quantity,
      minStock,
      unit: newItem.unit,
      status: quantity <= minStock ? "Low Stock" : "In Stock",
    })

    loadInventoryData()
    setNewItem({ name: "", category: "", quantity: "", minStock: "", unit: "" })
    setIsAddDialogOpen(false)
  }

  const handleUpdateStock = (item: InventoryRecord, action: "add" | "remove") => {
    setSelectedItem(item)
    setUpdateAction(action)
    setUpdateQuantity("")
    setUpdateReason("")
    setIsUpdateDialogOpen(true)
  }

  const handleConfirmUpdate = () => {
    if (!selectedItem || !updateQuantity || !updateReason) return

    const changeAmount = Number.parseInt(updateQuantity)
    const newQuantity =
      updateAction === "add" ? selectedItem.quantity + changeAmount : Math.max(0, selectedItem.quantity - changeAmount)

    InventoryDataManager.updateInventoryItem(selectedItem.id, { quantity: newQuantity }, updateReason, "Admin")

    loadInventoryData()
    setIsUpdateDialogOpen(false)
    setSelectedItem(null)
  }

  const handleRemoveItem = (id: number) => {
    if (confirm("Are you sure you want to remove this item from inventory?")) {
      const data = InventoryDataManager.getInventoryData()
      const filteredData = data.filter((item) => item.id !== id)
      InventoryDataManager.saveInventoryData(filteredData)
      loadInventoryData()
    }
  }

  // Generate stock level trends for the last 30 days
  const getStockTrends = () => {
    const trends: Record<string, any> = {}

    inventoryData.slice(0, 5).forEach((item) => {
      // Top 5 items for chart
      const data = []
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]

        // Simulate historical data (in real app, this would come from actual history)
        const baseQuantity = item.quantity
        const variation = Math.floor(Math.random() * 10) - 5
        const quantity = Math.max(0, baseQuantity + variation)

        data.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          [item.name]: quantity,
        })
      }

      if (!trends.data) trends.data = data
      else {
        trends.data = trends.data.map((entry: any, index: number) => ({
          ...entry,
          [item.name]: data[index][item.name],
        }))
      }
    })

    return trends.data || []
  }

  const stockTrendsData = getStockTrends()

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            </div>
            <p className="text-gray-600">Manage medical supplies and equipment with historical tracking</p>
          </div>

          {/* Action Buttons - Make responsive */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6">
            <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white hover:bg-gray-50">
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-purple-600" />
                    Inventory History
                  </DialogTitle>
                  <DialogDescription>Track all inventory changes and updates</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={historyDateRange.start}
                        onChange={(e) => setHistoryDateRange((prev) => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={historyDateRange.end}
                        onChange={(e) => setHistoryDateRange((prev) => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-left py-2 px-4 font-medium">Date</th>
                          <th className="text-left py-2 px-4 font-medium">Action</th>
                          <th className="text-left py-2 px-4 font-medium">Quantity</th>
                          <th className="text-left py-2 px-4 font-medium">Reason</th>
                          <th className="text-left py-2 px-4 font-medium">Updated By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryHistory.map((entry, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4 text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                            <td className="py-2 px-4">
                              <Badge
                                className={
                                  entry.action === "added"
                                    ? "bg-green-100 text-green-800"
                                    : entry.action === "removed"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                }
                              >
                                {entry.action}
                              </Badge>
                            </td>
                            <td className="py-2 px-4 text-sm">{entry.quantity}</td>
                            <td className="py-2 px-4 text-sm">{entry.reason}</td>
                            <td className="py-2 px-4 text-sm">{entry.updatedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="bg-white hover:bg-gray-50">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>

          {/* Stock Trends Chart */}
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Stock Level Trends (Last 30 Days)
              </CardTitle>
              <CardDescription className="text-purple-100">Monitor inventory levels over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer
                config={{
                  "Contrast Dye": { label: "Contrast Dye", color: "hsl(var(--chart-1))" },
                  "X-Ray Films": { label: "X-Ray Films", color: "hsl(var(--chart-2))" },
                  "Ultrasound Gel": { label: "Ultrasound Gel", color: "hsl(var(--chart-3))" },
                  "Disposable Gloves": { label: "Disposable Gloves", color: "hsl(var(--chart-4))" },
                  "MRI Coils": { label: "MRI Coils", color: "hsl(var(--chart-5))" },
                }}
                className="h-[200px] sm:h-[250px] lg:h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    {inventoryData.slice(0, 5).map((item, index) => (
                      <Line
                        key={item.name}
                        type="monotone"
                        dataKey={item.name}
                        stroke={`var(--color-${item.name.replace(/\s+/g, "")})`}
                        strokeWidth={2}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Enhanced Stats Cards - Make fully responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Total Items</CardTitle>
                <Package className="h-5 w-5 text-blue-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalItems}</div>
                <p className="text-xs text-blue-100 mt-1">In inventory</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-100">In Stock</CardTitle>
                <Package className="h-5 w-5 text-emerald-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{inStockItems}</div>
                <p className="text-xs text-emerald-100 mt-1">Well stocked</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-100">Low Stock</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{lowStockItems}</div>
                <p className="text-xs text-red-100 mt-1">Need restocking</p>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Table - Add mobile responsiveness */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Package className="h-5 w-5" />
                    Inventory Items
                  </CardTitle>
                  <CardDescription className="text-purple-100 text-sm">
                    Manage your medical supplies and equipment
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-white/90"
                    />
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-purple-600 hover:bg-purple-50 border-2 border-white w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                        <DialogDescription>Add a new item to the inventory system.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="name">Item Name</Label>
                          <Input
                            id="name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                              <SelectItem value="Imaging Supplies">Imaging Supplies</SelectItem>
                              <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
                              <SelectItem value="Equipment Parts">Equipment Parts</SelectItem>
                              <SelectItem value="Maintenance">Maintenance</SelectItem>
                              <SelectItem value="General Supplies">General Supplies</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={newItem.quantity}
                              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="minStock">Min Stock</Label>
                            <Input
                              id="minStock"
                              type="number"
                              value={newItem.minStock}
                              onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="unit">Unit</Label>
                          <Input
                            id="unit"
                            value={newItem.unit}
                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                            placeholder="e.g., Units, Boxes, Bottles"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddItem}>Add Item</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile Card Layout */}
              <div className="block lg:hidden">
                <div className="divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <div key={item.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                        {getStatusBadge(item)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-1 font-semibold">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Min Stock:</span>
                          <span className="ml-1">{item.minStock}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStock(item, "add")}
                          className="hover:bg-green-50 text-green-600 flex-1 sm:flex-none"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStock(item, "remove")}
                          className="hover:bg-red-50 text-red-600 flex-1 sm:flex-none"
                          disabled={item.quantity <= 0}
                        >
                          <Minus className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveItem(item.id)}
                          className="hover:bg-red-600 flex-1 sm:flex-none"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Item Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Min Stock</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Unit</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Last Updated</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{item.category}</td>
                        <td className="py-3 px-4 text-gray-600 font-semibold">{item.quantity}</td>
                        <td className="py-3 px-4 text-gray-600">{item.minStock}</td>
                        <td className="py-3 px-4 text-gray-600">{item.unit}</td>
                        <td className="py-3 px-4">{getStatusBadge(item)}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {new Date(item.lastUpdated).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStock(item, "add")}
                              className="hover:bg-green-50 text-green-600"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStock(item, "remove")}
                              className="hover:bg-red-50 text-red-600"
                              disabled={item.quantity <= 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveItem(item.id)}
                              className="hover:bg-red-600"
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Update Stock Dialog */}
          <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {updateAction === "add" ? (
                    <Plus className="h-5 w-5 text-green-600" />
                  ) : (
                    <Minus className="h-5 w-5 text-red-600" />
                  )}
                  {updateAction === "add" ? "Add Stock" : "Remove Stock"}
                </DialogTitle>
                <DialogDescription>
                  {updateAction === "add" ? "Add items to" : "Remove items from"} {selectedItem?.name} inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="current-stock">Current Stock</Label>
                  <Input id="current-stock" value={selectedItem?.quantity || 0} disabled className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="update-quantity">Quantity to {updateAction}</Label>
                  <Input
                    id="update-quantity"
                    type="number"
                    min="1"
                    value={updateQuantity}
                    onChange={(e) => setUpdateQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="update-reason">Reason</Label>
                  <Textarea
                    id="update-reason"
                    value={updateReason}
                    onChange={(e) => setUpdateReason(e.target.value)}
                    placeholder="Enter reason for stock update..."
                    rows={3}
                  />
                </div>
                {selectedItem && updateQuantity && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      New stock level:{" "}
                      <span className="font-semibold">
                        {updateAction === "add"
                          ? selectedItem.quantity + Number.parseInt(updateQuantity)
                          : Math.max(0, selectedItem.quantity - Number.parseInt(updateQuantity))}{" "}
                        {selectedItem.unit}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmUpdate}
                  disabled={!updateQuantity || !updateReason}
                  className={updateAction === "add" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                >
                  {updateAction === "add" ? "Add Stock" : "Remove Stock"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
