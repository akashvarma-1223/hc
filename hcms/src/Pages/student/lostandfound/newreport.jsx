"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { toast } from "sonner"
import api from "../../api/axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORIES = ["Electronics", "Books", "Clothing", "Accessories", "Documents", "Other"]

const NewReport = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Controlled form state
  const [formData, setFormData] = useState({
    type: "LOST",
    category: "",
    title: "",
    description: "",
    location: "",
    date: format(new Date(), "yyyy-MM-dd"),
  })

  // New state to handle the selected image
  const [selectedImage, setSelectedImage] = useState(null)

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] })
  }

  const validateForm = () => {
    let newErrors = {}

    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.date) newErrors.date = "Date is required"

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Check if selected image is PNG
    if (selectedImage && selectedImage.type !== "image/png") {
      toast.error("Only PNG images are allowed.")
      return
    }

    setIsSubmitting(true)

    try {
      const formattedDate = format(new Date(formData.date), "yyyy-MM-dd")
      const itemData = {
        name: formData.title,
        description: formData.description,
        location: formData.location,
        status: formData.type.toLowerCase(),
        additional_details: `Category: ${formData.category}`,
        date: formattedDate,
      }

      // Use FormData to send text + image
      const formDataToSend = new FormData()
      Object.entries(itemData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      if (selectedImage) {
        formDataToSend.append("image", selectedImage)
      }

      await api.post("/lost-found", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Report submitted successfully!")
      navigate("/LandF")
    } catch (error) {
      console.error("Error submitting report:", error)
      toast.error("Failed to submit report")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate("/LandF")} className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors">
            ←
          </button>
          <h1 className="text-xl font-bold text-blue-600">NITC HostelConnect</h1>
        </div>
      </div>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="bg-white rounded-xl border border-border/80 shadow-sm overflow-hidden p-6">
          <h1 className="text-xl font-semibold mb-6">New Lost & Found Report</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Type */}
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700">
                  Report Type
                </label>
                <Select
                  onValueChange={(value) => handleSelectChange("type", value)}
                  value={formData.type}
                >
                  <SelectTrigger >
                    <SelectValue placeholder="Select Report Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                    <SelectItem
                      value="LOST"
                      className="px-4 py-2 hover:bg-gray-100 transition-all"
                    >
                      Lost Item
                    </SelectItem>
                    <SelectItem
                      value="FOUND"
                      className="px-4 py-2 hover:bg-gray-100 transition-all"
                    >
                      Found Item
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>


              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium">Category</label>
                <Select onValueChange={(value) => handleSelectChange("category", value)} value={formData.category}>
                  <SelectTrigger >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">Title</label>
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="What did you lose/find?" />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed description of the item" rows={5} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* Image Upload (PNG only) */}
            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium">Image (PNG only)</label>
              <Input
                type="file"
                accept="image/png"
                onChange={(e) => {
                  setSelectedImage(e.target.files[0] || null)
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium">Location</label>
                <Input name="location" value={formData.location} onChange={handleChange} placeholder="Where was it lost/found?" />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label htmlFor="date" className="block text-sm font-medium">Date</label>
                <Input type="date" name="date" value={formData.date} onChange={handleChange} />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={() => navigate("/LandF")} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default NewReport
