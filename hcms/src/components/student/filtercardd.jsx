// import { ReportType } from "@/types";
import { cn } from "@/lib/utils";


const FilterTabss = ({ activeFilter, onChange }) => {
  const tabs = [
    { id: "All", label: "All Posts" },
    { id: "LOST", label: "Skills offered" },
    { id: "FOUND", label: "Skills offered" },
  ];

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-1 sm:w-auto w-full">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => onChange(tab.id)}
      className={cn(
        "px-4 py-2 rounded-md text-sm font-medium transition-all",
      
        activeFilter === tab.id
          ? "bg-blue-600 text-white shadow-sm"
          : "bg-gray-200 text-gray-600 hover:bg-gray-300"
      )}
    >
      {tab.label}
    </button>
  ))}
</div>

  );
};

export default FilterTabss;
