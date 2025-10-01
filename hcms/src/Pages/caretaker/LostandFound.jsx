"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/caretaker/use-Toast"
import { ChevronLeft, Package } from "lucide-react"
import api from "../api/axios"

const LostAndFoundd = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/lost-found")
        setItems(response.data)
      } catch (error) {
        console.error("Error fetching lost and found items:", error)
        toast({
          title: "Error",
          description: "Failed to load lost and found items",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/lost-found/${id}/status`, { status: newStatus })

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      )

      if (selectedItem && selectedItem.id === id) {
        setSelectedItem({ ...selectedItem, status: newStatus })
      }

      toast({
        title: "Status Updated",
        description: `Item status has been changed to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating item status:", error)
      toast({
        title: "Error",
        description: "Failed to update item status",
      })
    }
  }

  const openItemDetails = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "found":
        return (
          <Badge className="bg-[#F2FCE2] text-green-700 hover:bg-[#E2ECD2]">
            Found
          </Badge>
        )
      case "lost":
        return (
          <Badge className="bg-[#FFECEE] text-red-600 hover:bg-[#EFDCDE]">
            Lost
          </Badge>
        )
      case "claimed":
        return (
          <Badge className="bg-[#E0F2FE] text-blue-600 hover:bg-[#D0E2EE]">
            Claimed
          </Badge>
        )
      case "With Caretaker":
        return (
          <Badge className="bg-[#E0F2FE] text-blue-600 hover:bg-[#D0E2EE]">
            With Caretaker
          </Badge>
        )
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"> */}
        {/* Header */}
        <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-600"
            onClick={() => navigate("/dashboardc")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-green-100 p-2 rounded-md">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lost & Found</h1>
            <p className="text-gray-500 mt-1">
              Track and manage lost and found items
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Loading items...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>View Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.reported_by}</TableCell>
                      <TableCell>
                        {new Date(item.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {item.image ? (
                          <Button
                            variant="outline"
                            onClick={() => openItemDetails(item)}
                          >
                            View
                          </Button>
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={item.status}
                          onValueChange={(value) =>
                            handleStatusChange(item.id, value)
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                            <SelectItem value="lost">Lost</SelectItem>
                            <SelectItem value="found">Found</SelectItem>
                            <SelectItem value="With Caretaker">With Caretaker</SelectItem>
                            <SelectItem value="claimed">Claimed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedItem.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 mt-1">
                    Status: {getStatusBadge(selectedItem.status)}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="space-y-4">
                    {selectedItem.image ? (
                      <div className="flex justify-center">
                        <img
                          src={selectedItem.image}
                          alt={selectedItem.name}
                          className="max-h-[200px] rounded-md object-contain border p-2"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <img
                          src="/placeholder.svg"
                          alt="Placeholder"
                          className="max-h-[200px] rounded-md object-contain border p-2"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Location
                        </p>
                        <p>{selectedItem.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Reported By
                        </p>
                        <p>{selectedItem.reported_by}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Date
                        </p>
                        <p>
                          {new Date(selectedItem.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {selectedItem.additional_details && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Additional Details
                        </p>
                        <p className="text-sm">
                          {selectedItem.additional_details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Select
                    defaultValue={selectedItem.status}
                    onValueChange={(value) =>
                      handleStatusChange(selectedItem.id, value)
                    }
                  >
                    <SelectTrigger className="w-[120px] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                      <SelectItem value="claimed">Claimed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default LostAndFoundd
