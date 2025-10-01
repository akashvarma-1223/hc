import React, { useEffect, useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from "../api/axios"; 

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('user/profile'); 
        const data = response.data;
        setFormData({
          name: data.name || '',
          rollNumber: data.rollnumber || '',
          roomNumber: data.roomNo || '',
          hostelBlock: data.hostelblock || '',
          email: data.email || '',
        });
      } catch (err) {
        toast.error("Error fetching profile");
        console.error("Fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleBackClick = () => navigate('/dashboards');

  if (!formData) return <div className="text-center p-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 border-b flex items-center">
        <button onClick={handleBackClick} className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-600">NITC HostelConnect</h1>
      </header>

      {/* Profile Settings Form */}
      <div className="max-w-3xl mx-auto my-6 p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <p className="text-gray-500">Manage your personal information</p>
            </div>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              className="w-full px-4 py-2 border rounded-md"
              disabled
            />
          </div>

          <div>
            <label htmlFor="rollNumber" className="block text-gray-700 mb-2">Roll Number</label>
            <input
              id="rollNumber"
              name="rollNumber"
              type="text"
              value={formData.rollNumber}
              className="w-full px-4 py-2 border rounded-md"
              disabled
            />
          </div>

          <div>
            <label htmlFor="roomNumber" className="block text-gray-700 mb-2">Room Number</label>
            <input
              id="roomNumber"
              name="roomNumber"
              type="text"
              value={formData.roomNumber}
              className="w-full px-4 py-2 border rounded-md"
              disabled
            />
          </div>

          <div>
            <label htmlFor="hostelBlock" className="block text-gray-700 mb-2">Hostel Block</label>
            <input
              id="hostelBlock"
              name="hostelBlock"
              type="text"
              value={formData.hostelBlock}
              className="w-full px-4 py-2 border rounded-md"
              disabled
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              className="w-full px-4 py-2 border rounded-md"
              disabled
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
