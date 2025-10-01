"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/caretaker/use-Toast"
import Header from "@/components/caretaker/dashboard/Header"
import SummaryCard from "@/components/caretaker/dashboard/SummaryCard"
import ActionCard from "@/components/caretaker/dashboard/ActionCard"
import ActivityItem from "@/components/caretaker/dashboard/ActivityItem"
import AnnouncementModal from "@/components/caretaker/dashboard/AnnouncementModal"
import { MessageSquare, Search, Clock, BellRing } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

const Dashc = () => {
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [summaryData, setSummaryData] = useState([
    { title: "Pending Complaints", count: 0, icon: <MessageSquare size={20} />, variant: "complaint" },
    { title: "Lost Items", count: 0, icon: <Search size={20} />, variant: "lost" },
    { title: "Entry Requests", count: 0, icon: <Clock size={20} />, variant: "entry" },
    { title: "Announcements", count: 0, icon: <BellRing size={20} />, variant: "announcement" },
  ])
  const [activityItems, setActivityItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Fetch counts for summary cards
        const [complaintsRes, lostFoundRes, lateEntryRes, announcementsRes] = await Promise.all([
          api.get("/complaints"),
          api.get("/lost-found"),
          api.get("/late-entry"),
          api.get("/announcements"),
        ])

        // Update summary data with counts
        const pendingComplaints = complaintsRes.data.filter((c) => c.status === "pending").length
        const lostItems = lostFoundRes.data.filter((i) => i.status === "lost").length
        const pendingRequests = lateEntryRes.data.filter((r) => r.status === "pending").length
        const announcements = announcementsRes.data.length

        setSummaryData([
          {
            title: "Pending Complaints",
            count: pendingComplaints,
            icon: <MessageSquare size={20} />,
            variant: "complaint",
          },
          { title: "Lost Items", count: lostItems, icon: <Search size={20} />, variant: "lost" },
          { title: "Entry Requests", count: pendingRequests, icon: <Clock size={20} />, variant: "entry" },
          { title: "Announcements", count: announcements, icon: <BellRing size={20} />, variant: "announcement" },
        ])

        // Create activity items from recent data
        const recentActivity = []

        // Add recent complaints
        if (complaintsRes.data.length > 0) {
          const recentComplaint = complaintsRes.data[0]
          recentActivity.push({
            color: "complaint",
            content: `New complaint from ${recentComplaint.room} regarding ${recentComplaint.description.substring(0, 30)}...`,
            time: new Date(recentComplaint.submitted).toLocaleString(),
          })
        }

        // Add recent lost items
        if (lostFoundRes.data.length > 0) {
          const recentItem = lostFoundRes.data.find((i) => i.status === "lost") || lostFoundRes.data[0]
          recentActivity.push({
            color: "lost",
            content: `${recentItem.status === "lost" ? "Lost" : "Found"} item reported: ${recentItem.name} in ${recentItem.location}`,
            time: new Date(recentItem.date).toLocaleString(),
          })
        }

        // Add recent late entry requests
        if (lateEntryRes.data.length > 0) {
          const recentRequest = lateEntryRes.data[0]
          recentActivity.push({
            color: "entry",
            content: `Late entry request ${recentRequest.status} for Student ID: ${recentRequest.student_id}`,
            time: new Date(recentRequest.timestamp).toLocaleString(),
          })
        }

        setActivityItems(recentActivity)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleAction = (section) => {
    const routes = {
      announcements: "/announcements",
      complaints: "/comps",
      lostfound: "/lndf",
      entryrequests: "/l",
    }

    if (routes[section.toLowerCase()]) {
      navigate(routes[section.toLowerCase()])
    } else {
      toast({
        title: `Navigating to ${section}`,
        description: `You are being redirected to the ${section} section.`,
      })
    }
  }

  const handleNewPost = () => {
    setShowAnnouncementModal(true)
  }

  const handleCloseModal = () => {
    setShowAnnouncementModal(false)
  }

  const handleSubmitAnnouncement = async (data) => {
    try {
      const announcementData = {
        title: data.title,
        content: data.content,
        category: data.type === "Block Specific" ? data.block || "" : data.type,
        has_attachment: !!data.attachment,
        attachment_url: data.attachment || null,
      }

      await api.post("/announcements", announcementData)

      // Update the announcements count
      setSummaryData((prev) =>
        prev.map((item) => (item.title === "Announcements" ? { ...item, count: item.count + 1 } : item)),
      )

      toast({
        title: "Announcement Created",
        description: `"${data.title}" has been posted successfully.`,
      })

      setShowAnnouncementModal(false)
    } catch (error) {
      console.error("Error creating announcement:", error)
      toast({
        title: "Error",
        description: "Failed to create announcement",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="w-full bg-white shadow-md p-3 rounded-lg">
          <Header />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          ) : (
            summaryData.map((item, index) => (
              <SummaryCard
                key={item.title}
                title={item.title}
                count={item.count}
                icon={item.icon}
                variant={item.variant}
                animationDelay={`animate-delay-${index * 100}`}
              />
            ))
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <ActionCard
            title="Complaints"
            description="Manage and respond to student complaints"
            icon={<MessageSquare size={20} />}
            variant="complaint"
            onAction={() => handleAction("complaints")}
            animationDelay="animate-delay-100"
            className="bg-white"
          />

          <ActionCard
            title="Lost & Found"
            description="Track and verify lost & found items"
            icon={<Search size={20} />}
            variant="lost"
            onAction={() => handleAction("lostfound")}
            animationDelay="animate-delay-200"
            className="bg-white"
          />

          <ActionCard
            title="Late Entry Requests"
            description="Review and approve late entry requests"
            icon={<Clock size={20} />}
            variant="entry"
            onAction={() => handleAction("entryrequests")}
            animationDelay="animate-delay-300"
            className="bg-white"
          />

          <ActionCard
            title="Announcements"
            description="Post notices to students"
            icon={<BellRing size={20} />}
            variant="announcement"
            onAction={() => handleAction("announcements")}
            onSecondaryAction={handleNewPost}
            secondaryButtonText="New Post"
            animationDelay="animate-delay-400"
            className="bg-white"
          />
        </div>

        <div className="mt-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-muted-foreground" />
              Recent Activity
            </h2>
            <div className="divide-y">
              {isLoading ? (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">Loading activity...</p>
                </div>
              ) : activityItems.length > 0 ? (
                activityItems.map((item, index) => (
                  <ActivityItem
                    key={index}
                    color={item.color}
                    content={item.content}
                    time={item.time}
                    className={`animate-delay-${index * 100}`}
                  />
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <footer className="mt-8 py-4 text-center text-sm text-muted-foreground">
          <p>© 2023 Hostel Management System. All rights reserved.</p>
        </footer> */}
      </div>

      {showAnnouncementModal && (
        <AnnouncementModal
          isOpen={showAnnouncementModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitAnnouncement}
        />
      )}
    </div>
  )
}

export default Dashc

