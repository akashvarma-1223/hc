// import { ReportType } from "@/types";
import { cn } from "@/lib/utils";


const FilterTabs = ({ activeFilter, onChange }) => {
  const tabs = [
    { id: "ALL", label: "All Items" },
    { id: "LOST", label: "Lost Items" },
    { id: "FOUND", label: "Found Items" },
    { id: "With Caretaker", label: "Your Lost Items" },
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

export default FilterTabs;
