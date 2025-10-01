import { motion } from "framer-motion";
import React from "react";



const SkillTabs= ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-2 mb-4">
      <TabButton 
        isActive={activeTab === "all"} 
        onClick={() => setActiveTab("all")}
      >
        All Posts
      </TabButton>
      <TabButton 
        isActive={activeTab === "offered"} 
        onClick={() => setActiveTab("offered")}
      >
        Skills Offered
      </TabButton>
      <TabButton 
        isActive={activeTab === "wanted"} 
        onClick={() => setActiveTab("wanted")}
      >
        Skills Wanted
      </TabButton>
    </div>
  );
};

const TabButton= ({ children, isActive, onClick }) => {
  return (
    <button
      className={`tab-button relative ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-nitc-blue rounded-md z-[-1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </button>
  );
};

export default SkillTabs;
