import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import type { Category } from "@shared/schema";

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: number;
  onCategorySelect: (id: number) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onAddCategory: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Sidebar({
  categories,
  selectedCategoryId,
  onCategorySelect,
  collapsed,
  onToggleCollapse,
  onAddCategory,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const getCategoryIcon = (icon: string) => {
    const iconMap: Record<string, string> = {
      "fas fa-hand-pointer": "👆",
      "fas fa-heading": "H",
      "fas fa-layer-group": "📦",
      "fas fa-bars": "≡",
      "fas fa-images": "🖼️",
      "fas fa-shoe-prints": "👟",
      "fas fa-magic": "✨",
    };
    return iconMap[icon] || "📁";
  };

  if (collapsed) {
    return (
      <aside className="w-16 bg-pp-secondary border-r border-pp-accent flex flex-col transition-all duration-300">
        <div className="p-3 border-b border-pp-accent">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white w-full p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 p-2 space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              onClick={() => onCategorySelect(category.id)}
              className={`w-full h-12 p-0 ${
                selectedCategoryId === category.id
                  ? "bg-pp-orange text-pp-dark"
                  : "bg-pp-accent hover:bg-gray-600"
              } transition-colors`}
              title={category.name}
            >
              <span className="text-lg">{getCategoryIcon(category.icon)}</span>
            </Button>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-pp-secondary border-r border-pp-accent flex flex-col transition-all duration-300">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-pp-accent">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Component Library</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-pp-accent text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-pp-orange border-none"
          />
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-400">CATEGORIES</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddCategory}
              className="text-pp-orange hover:text-orange-400 text-sm p-1 h-auto"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
          
          {/* Category List */}
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedCategoryId === category.id
                    ? "bg-pp-orange text-pp-dark"
                    : "bg-pp-accent hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getCategoryIcon(category.icon)}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      selectedCategoryId === category.id
                        ? "bg-black bg-opacity-20"
                        : "bg-pp-orange text-pp-dark"
                    }`}
                  >
                    {category.componentCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
