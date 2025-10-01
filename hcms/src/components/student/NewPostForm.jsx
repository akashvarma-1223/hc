import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/Pages/api/axios";

const categories = [
  "Programming", "Music", "Sports", "Art", "Languages", "Academics", "Others"
];

const postTypes = [
  { value: "OFFERING", label: "Offering Skill" },
  { value: "SEEKING", label: "Seeking Skill" }
];

const NewPostForm = ({ onClose, onPostSuccess }) => {
  const [formData, setFormData] = useState({
    postType: "OFFERING",
    category: "",
    title: "",
    description: "",
    timings: "",
    venue: "",
    maxPeople: 1, // Default value for max participants
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Submitting Data:", formData); // Debugging

    try {
      const response = await api.post("/skillpost", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response.data);
      onPostSuccess(response.data); // Notify parent component
      onClose(); // Close modal
      window.location.reload();
    } catch (error) {
      console.error("API Error:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold mb-4">New Skill Sharing Post</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Post Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Post Type</label>
          <select
            name="postType"
            value={formData.postType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            {postTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="What skill are you offering/seeking?"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Description (Optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide more details..."
            className="w-full px-4 py-2 border rounded-md h-24 resize-none"
          />
        </div>

        {/* Venue */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleInputChange}
            placeholder="Location"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Timings */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Timings</label>
          <input
            type="text"
            name="timings"
            value={formData.timings}
            onChange={handleInputChange}
            placeholder="e.g., Weekends, 6-8 PM"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Max Participants (Editable) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Max Participants</label>
          <input
            type="number"
            name="maxPeople"
            value={formData.maxPeople}
            onChange={handleInputChange}
            min="1"
            max="100"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button type="submit" variant="outline" className="bg-blue-600 text-white" disabled={loading}>
            {loading ? "Posting..." : "Create Post"}
          </Button>
          <Button type="button" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;