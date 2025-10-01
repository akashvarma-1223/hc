import { useState, useEffect } from "react";
import { Calendar, User, Users, Info } from "lucide-react";
import api from "@/Pages/api/axios";

const SkillPost = ({
  id,
  postType,
  category,
  title,
  description,
  timings,
  maxPeople,
  venue,
  currentParticipants,
  postedBy,
  userId,
  onJoin,
  onLeave
}) => {
  const [loading, setLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [userJoined, setUserJoined] = useState(false);
  const [participants, setParticipants] = useState(currentParticipants);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "join" or "leave"

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setLoggedInUserId(data.userId);

        const { data: joinedPosts } = await api.get(`/skillpost/joined/${data.userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setUserJoined(joinedPosts.some(post => post.id === id));
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [id]);

  const confirmAction = (type) => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setShowConfirmModal(false);

    try {
      if (actionType === "join") {
        await onJoin(id);
        setUserJoined(true);
        setParticipants(prev => prev + 1);
      } else {
        await onLeave(id);
        setUserJoined(false);
        setParticipants(prev => prev - 1);
      }
      window.location.reload();
    } catch (error) {
      console.error(`Error ${actionType}ing post:`, error);
    }

    setLoading(false);
  };

  const isFull = participants >= maxPeople;
  const isCreator = loggedInUserId === userId;

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-all duration-300 flex flex-col">
        
        <div
          className="absolute top-3 right-3 flex items-center gap-1 cursor-pointer"
          onMouseEnter={() => setShowDescription(true)}
          onMouseLeave={() => setShowDescription(false)}
        >
          <Info className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          <span className="text-xs text-gray-600">Description</span>
        </div>

        {showDescription && (
          <div className="absolute top-8 right-3 bg-white shadow-lg border border-gray-300 p-3 rounded-md w-48 text-sm text-gray-700 z-50">
            {description}
          </div>
        )}

        <div className="flex items-center gap-3 mb-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full 
              ${postType === "OFFERING" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
          >
            {postType}
          </span>
          <span className="text-gray-500">{category}</span>
        </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{timings}</span>
              <span>{venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {participants}/{maxPeople} participant(s)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Posted by: {postedBy}</span>
            </div>
          </div>

          {!isCreator && (
            userJoined ? (
              <button
                onClick={() => confirmAction("leave")}
                disabled={loading}
                className="text-sm px-3 py-1 rounded-md border bg-red-600 text-white border-red-600 hover:bg-red-700 transition-all"
              >
                {loading ? "Leaving..." : "Leave"}
              </button>
            ) : (
              <button
                onClick={() => confirmAction("join")}
                disabled={loading || isFull}
                className={`text-sm px-3 py-1 rounded-md border transition-all ${
                  isFull
                    ? "bg-gray-400 text-white border-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Joining..." : isFull ? "Full" : "Join"}
              </button>
            )
          )}
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-3">
              {actionType === "join" ? "Confirm Joining" : "Confirm Leaving"}
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to {actionType} this skill-sharing session?
            </p>
            <div className="flex justify-center gap-4">
            <button
             onClick={handleConfirm}
             className={`px-4 py-2 rounded-md transition-all text-white ${
               actionType === "leave" ? "bg-red-600 hover:bg-red-700": "bg-blue-600 hover:bg-blue-700" }`}>
                Yes, {actionType}
                </button>

              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SkillPost;
