import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Upload, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const LateEntryRequest = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleUploadChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (selectedFile.size > maxSize) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }
      
      const fileType = selectedFile.type;
      if (!["application/pdf", "image/jpeg", "image/png"].includes(fileType)) {
        toast.error("Invalid file type. Please upload a PDF, JPG, or PNG.");
        return;
      }
      
      setFile(selectedFile);
      toast.success("File uploaded successfully.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!date || !reason.trim() || !file) {
      toast.error("All fields are required.");
      return;
    }
  
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("reason", reason);
    formData.append("attachment", file); 
  
    try {
  
      const response = await fetch("http://localhost:5000/api/late-entry", {
        method: "POST",
        credentials: "include",
        body: formData, 
      });
  
      const data = await response.json();
      console.log("Response:", data);
      
      if (response.ok) {
        toast.success(data.message);
        navigate("/dashboards");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Error submitting request. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/dashboards')} 
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-blue-600">NITC HostelConnect</h1>
        </div>
      </div>

      <main className="app-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-xl font-semibold mb-2">Late Entry Request</h2>
          <p className="text-gray-500 mb-6">Submit your late entry request with necessary details and proof.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date of Late Entry</label>
              <div className="relative">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full justify-start text-left font-normal text-gray-500 border-gray-200"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
                
                {isCalendarOpen && (
                  <div className="absolute mt-2 bg-white shadow-lg rounded-md p-3 border z-50">
                    <DayPicker 
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setIsCalendarOpen(false);
                      }}
                      // disabled={{ after: new Date() }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Reason Textarea */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a detailed reason for late entry."
                className="min-h-[120px] text-gray-700 border-gray-200"
              />
            </div>
            
            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Proof Document</label>
              <div className="border border-dashed border-gray-300 rounded-md p-4">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-sm text-center text-gray-500">
                    {file ? file.name : "Upload proof document"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleUploadChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG (Max size: 5MB)</p>
            </div>
            
            {/* Submit & Cancel Buttons */}
            <div className="flex justify-end space-x-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/late")}
                className="border-gray-200 text-gray-700"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-nitc-blue hover:bg-blue-600"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default LateEntryRequest;
