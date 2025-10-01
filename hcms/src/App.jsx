import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/login";
import Index from "./Pages/student/dashboard";
import Profile from "./Pages/student/profile";
import Complaints from "./Pages/student/complaints/complaints";
// import SkillSharingPage from "./Pages/student/skillsharing";
import LostAndFound from "./Pages/student/lostandfound/LandF";
import NewReport from "./Pages/student/lostandfound/newreport";
import Late from "./Pages/student/late";
import FoodSharing from "./Pages/student/FoodSharing";
import NewFoodPost from "./Pages/student/NewFoodPost";
import Skill from "./Pages/student/skillsharing/skillsharing";
import Dashc from "./Pages/caretaker/index";
import LostAndFoundd from "./Pages/caretaker/LostandFound";
import Complaintss from "./Pages/caretaker/complaints";
import Announcements from "./Pages/caretaker/Annoucements";
import Announcementss from "./Pages/student/annoucements";
import LateEntryRequestss from "./Pages/caretaker/lateentry";
import LateEntryRequest from "./Pages/student/LateEntryRequest";

import './index.css'

function App() {

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboards" element={<Index />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/Complaints" element={<Complaints />} />           
      <Route path="/comps" element={<Complaintss />} />           
      {/* <Route path="/skill" element={<SkillSharingPage />} /> */}
      <Route path="/LandF" element={<LostAndFound />} />
      <Route path="/newr" element={<NewReport />} />  
      <Route path="/Late" element={<Late />} />  
      <Route path="/food" element={<FoodSharing />} />  
      <Route path="/skill" element={<Skill />} />
      <Route path="/nfp" element={<NewFoodPost />} />
      <Route path="/dashboardc" element={<Dashc />} />
      <Route path="/lndf" element={<LostAndFoundd />} />
      <Route path="/com" element={<Complaintss />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/l" element={<LateEntryRequestss />} />
      <Route path="/ll" element={<LateEntryRequest />} />
      <Route path="/sannoucements" element={<Announcementss  />} />



      </Routes>
    </Router>
  )
}

export default App
