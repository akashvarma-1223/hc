import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Reusable dropdown
const Dropdown = ({ label, value, options, onSelect, isOpen, toggleDropdown }) => (
  <div className={cn("relative transition-all duration-200", isOpen ? "mb-60" : "mb-4")}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <button
        type="button"
        className="w-full flex justify-between items-center border rounded-md px-4 py-2 bg-white"
        onClick={toggleDropdown}
      >
        <span>{value || `Select ${label.toLowerCase()}`}</span>
        <svg
          className={cn("w-4 h-4 transition-transform", isOpen ? "transform rotate-180" : "")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(option);
                  toggleDropdown();
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const AnnouncementModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Block Specific');
  const [block, setBlock] = useState('');
  const [category, setCategory] = useState('General');

  const [dropdownOpen, setDropdownOpen] = useState({
    block: false,
    type: false,
    category: false,
  });

  const blockOptions = ['Block A', 'Block B', 'Block C', 'Block D'];
  const typeOptions = ['Block Specific', 'All Blocks'];
  const categoryOptions = ['General', 'Maintenance', 'Electrical', 'Other'];

  const toggleDropdown = (name) => {
    setDropdownOpen((prev) => {
      // Close all others except the one clicked
      const newState = { block: false, type: false, category: false };
      newState[name] = !prev[name];
      return newState;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      type,
      category,
      ...(type === 'Block Specific' && { block }),
    });
  };

  if (!isOpen) return null;

  const isFormValid =
    title.trim() &&
    content.trim() &&
    category.trim() &&
    type.trim() &&
    (type !== 'Block Specific' || block.trim());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative animate-scale-in">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Announcement</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter announcement title"
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-announcement"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter announcement content"
                  rows={5}
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-announcement resize-none"
                  required
                />
              </div>

              {/* Category */}
              <Dropdown
                label="Category"
                value={category}
                options={categoryOptions}
                onSelect={setCategory}
                isOpen={dropdownOpen.category}
                toggleDropdown={() => toggleDropdown('category')}
              />

              {/* Type */}
              <Dropdown
                label="Type"
                value={type}
                options={typeOptions}
                onSelect={setType}
                isOpen={dropdownOpen.type}
                toggleDropdown={() => toggleDropdown('type')}
              />

              {/* Block */}
              {type === 'Block Specific' && (
                <Dropdown
                  label="Block"
                  value={block}
                  options={blockOptions}
                  onSelect={setBlock}
                  isOpen={dropdownOpen.block}
                  toggleDropdown={() => toggleDropdown('block')}
                />
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  // disabled={!isFormValid}
                >
                  Create Announcement
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
