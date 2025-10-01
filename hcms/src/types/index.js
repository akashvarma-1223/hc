const SkillPostType = {
  OFFERING: "offering",
  SEEKING: "seeking",
};

const SkillCategory = {
  PROGRAMMING: "Programming",
  MUSIC: "Music",
  SPORTS: "Sports",
  ART: "Art",
  LANGUAGES: "Languages",
  ACADEMICS: "Academics",
  OTHERS: "Others",
};

const CATEGORIES = [
  "Personal Items",
  "Electronics",
  "Documents",
  "Accessories", 
  "Books",
  "Clothing",
  "Other"
];

const MOCK_ITEMS = [
  {
      id: "1",
      type: "LOST",
      title: "Black Wallet",
      description: "Lost my black leather wallet near the library",
      category: "Personal Items",
      location: "Main Library",
      date: "2024-03-20",
  },
  {
      id: "2",
      type: "FOUND",
      title: "Calculator",
      description: "Found a scientific calculator in Room 201",
      category: "Electronics",
      location: "Academic Block",
      date: "2024-03-19",
  },
  {
      id: "3",
      type: "LOST",
      title: "Blue Backpack",
      description: "Left my blue Jansport backpack in the cafeteria",
      category: "Personal Items",
      location: "Cafeteria",
      date: "2024-03-18",
  },
  {
      id: "4",
      type: "FOUND",
      title: "Student ID Card",
      description: "Found a student ID card for John Smith near the basketball court",
      category: "Documents",
      location: "Sports Complex",
      date: "2024-03-21",
  }
];
const ReportType = {
  LOST: "LOST",
  FOUND: "FOUND"
};

const Category = [
  "Personal Items",
  "Electronics",
  "Documents",
  "Accessories",
  "Books",
  "Clothing",
  "Other"
];

export { SkillPostType, SkillCategory, ReportType, CATEGORIES, MOCK_ITEMS,Category };
