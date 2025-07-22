import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Category, Component } from "@shared/schema";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComponentLibrary from "@/components/ComponentLibrary";
import CodeEditor from "@/components/CodeEditor";
import AddCategoryModal from "@/components/AddCategoryModal";
import AddComponentModal from "@/components/AddComponentModal";

export default function CodeLibrary() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: components = [] } = useQuery<Component[]>({
    queryKey: ["/api/components", { categoryId: selectedCategoryId }],
    queryFn: async () => {
      const response = await fetch(`/api/components?categoryId=${selectedCategoryId}`);
      return response.json();
    },
    enabled: !!selectedCategoryId,
  });

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  return (
    <div className="h-screen bg-pp-dark text-white overflow-hidden">
      <Header 
        onSaveProject={() => console.log("Save project")}
        onExport={() => console.log("Export project")}
      />
      
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onAddCategory={() => setShowAddCategoryModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <ComponentLibrary
          category={selectedCategory}
          components={components}
          selectedComponent={selectedComponent}
          onComponentSelect={setSelectedComponent}
          onAddComponent={() => setShowAddComponentModal(true)}
        />
      </div>

      <AddCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
      />

      <AddComponentModal
        isOpen={showAddComponentModal}
        onClose={() => setShowAddComponentModal(false)}
        categories={categories}
        defaultCategoryId={selectedCategoryId}
      />

      {/* Code Editor Modal */}
      {selectedComponent && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedComponent(null);
            }
          }}
        >
          <div className="bg-pp-dark rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden">
            <CodeEditor
              selectedComponent={selectedComponent}
              onCloseComponent={() => setSelectedComponent(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
