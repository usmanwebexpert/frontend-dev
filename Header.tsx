import { Button } from "@/components/ui/button";
import { Save, Share, User } from "lucide-react";
import logoPath from "@assets/Code Library (1)_1753179757640.png";

interface HeaderProps {
  onSaveProject: () => void;
  onExport: () => void;
}

export default function Header({ onSaveProject, onExport }: HeaderProps) {
  return (
    <header className="bg-pp-secondary border-b border-pp-accent px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        {/* Power Pack Logo */}
        <div className="flex items-center space-x-3">
          <img 
            src={logoPath} 
            alt="Power Pack Code Library" 
            className="h-8 w-auto"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onSaveProject}
          className="px-4 py-2 bg-pp-orange text-pp-dark rounded-lg font-medium hover:bg-orange-500 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Project
        </Button>
        <Button 
          onClick={onExport}
          className="px-4 py-2 bg-pp-accent text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          <Share className="w-4 h-4 mr-2" />
          Export
        </Button>
        <div className="w-8 h-8 bg-pp-orange rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-pp-dark" />
        </div>
      </div>
    </header>
  );
}
