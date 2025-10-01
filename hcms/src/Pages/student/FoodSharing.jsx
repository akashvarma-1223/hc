import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FoodCard from "@/components/student/FoodCard";
import api from "../api/axios"; // ✅ Import API instance
import { toast } from "sonner"; // ✅ Toast notifications

const FoodSharing = () => {
  const [foodPosts, setFoodPosts] = useState([]); // ✅ State to store posts
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodPosts = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Get token from localStorage
        if (!token) {
          toast.error("Unauthorized: No token found!");
          setIsLoading(false);
          return;
        }

        const response = await api.get("/foodpost", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setFoodPosts(response.data); // ✅ Store API response in state
      } catch (error) {
        toast.error("Failed to load food posts!");
        console.error("Error fetching food posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate("/dashboards")}
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-blue-600">NITC HostelConnect</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="app-container py-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-4xl px-6">
          {/* Page Header & "New Post" Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold">Food Sharing</h2>
              <p className="text-gray-500">Share your extra food or find a meal</p>
            </div>
            <Link
              to="/nfp"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              <PlusCircle size={18} />
              New Post
            </Link>
          </div>

          {/* Food Posts Section */}
          {isLoading ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {[1, 2].map((n) => (
                <div 
                  key={n} 
                  className="h-40 bg-white/40 animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {foodPosts.length > 0 ? (
                  foodPosts.map((post, index) => (
                    <FoodCard key={post.id} post={post} index={index} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-xl shadow-sm border border-border p-8 text-center"
                  >
                    <p className="text-gray-500 mb-4">No food sharing posts yet.</p>
                    <Link to="/nfp" className="text-nitc-blue hover:underline">
                      Create the first post
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default FoodSharing;