import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Copy } from "lucide-react";
import type { Category, Component } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ComponentLibraryProps {
  category?: Category;
  components: Component[];
  selectedComponent: Component | null;
  onComponentSelect: (component: Component) => void;
  onAddComponent: () => void;
}

export default function ComponentLibrary({
  category,
  components,
  selectedComponent,
  onComponentSelect,
  onAddComponent,
}: ComponentLibraryProps) {
  const [filter, setFilter] = useState("All");
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const filters = ["All", "Primary", "Secondary", "Icon"];

  return (
    <div className="flex-1 bg-pp-dark flex flex-col">
      {/* Component Library Header */}
      <div className="p-4 border-b border-pp-accent">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">
            {category?.name || "Select Category"} Components
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddComponent}
            className="text-pp-orange hover:text-orange-400 text-sm p-1 h-auto"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Component
          </Button>
        </div>
        
        {/* Filter Options */}
        <div className="flex space-x-2 text-sm">
          {filters.map((filterName) => (
            <Button
              key={filterName}
              variant={filter === filterName ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilter(filterName)}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filter === filterName
                  ? "bg-pp-orange text-pp-dark"
                  : "bg-pp-accent text-white hover:bg-gray-600"
              }`}
            >
              {filterName}
            </Button>
          ))}
        </div>
      </div>

      {/* Component Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {components.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="mb-4">No components in this category yet.</p>
            <Button
              onClick={onAddComponent}
              className="bg-pp-orange text-pp-dark hover:bg-orange-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Component
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {components.map((component) => (
              <div
                key={component.id}
                onClick={() => onComponentSelect(component)}
                className={`component-card bg-pp-secondary rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  selectedComponent?.id === component.id
                    ? "ring-2 ring-pp-orange"
                    : "hover:bg-pp-accent"
                }`}
              >
                <div className="mb-3">
                  <div className="bg-white p-3 rounded min-h-[80px] flex items-center justify-center text-sm overflow-hidden">
                    <div
                      dangerouslySetInnerHTML={{ 
                        __html: `
                          <style>
                            ${component.css}
                          </style>
                          ${component.html}
                        `
                      }}
                      className="w-full flex items-center justify-center scale-90 transform-origin-center"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white truncate">
                    {component.name}
                  </h4>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400 truncate flex-1">
                      {component.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(component.html);
                      }}
                      className="text-pp-orange hover:text-orange-400 p-1 h-auto ml-1"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
