import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "../api/axios";
import { Textarea } from "@/components/ui/textarea";

const postTypes = [
  { id: "offering", label: "Offering Food" },
  { id: "requesting", label: "Requesting Food" },
];

const NewFoodPost = () => {
  const navigate = useNavigate();
  const [postType, setPostType] = useState("offering");
  const [roomNo, setRoomNo] = useState(""); // ✅ Added roomNo state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roomNo.trim() || !title.trim() || !description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
  
    const postData = {
      location: roomNo,
      title,
      description,
      price: price || "Free",
      post_type: postType === "offering" ? "Offering Food" : "Requesting Food",
    };
  
    try {

      const token = localStorage.getItem("token");
       console.log(token);
       console.log(postData);
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
  
      const response = await api.post("/foodpost", postData, {
        "Content-Type": "application/json",
        headers: { Authorization: `Bearer ${token}` }, // ✅ Send token explicitly
      });
      console.log(response.data);
  
      toast.success("Food sharing post created successfully!");
      setTimeout(() => navigate("/food"), 500);
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Authentication failed. Please log in again.");
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate("/food")}
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-blue-600">NITC HostelConnect</h1>
        </div>
      </div>
      
      <main className="app-container py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-xl font-semibold mb-2">New Food Sharing Post</h2>
            <p className="text-gray-600 mb-6">Share extra food or request what you need</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Post Type</label>
                <div className="flex space-x-4">
                  {postTypes.map((type) => (
                    <label 
                      key={type.id} 
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="postType"
                        value={type.id}
                        checked={postType === type.id}
                        onChange={() => setPostType(type.id)}
                        className="h-4 w-4 text-nitc-blue focus:ring-nitc-blue border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* ✅ Fixed Room No field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Room No</label>
                <input
                  type="text"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  placeholder="Enter Room No"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the food item"
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price or 'Free'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/food")}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  className="bg-blue-600 text-white"
                >
                  Post
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NewFoodPost;