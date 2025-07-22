import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertCategory } from "@shared/schema";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const response = await apiRequest("POST", "/api/categories", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success!",
        description: "Category created successfully",
      });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setFormData({ name: "", icon: "", description: "" });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }
    
    createCategoryMutation.mutate({
      name: formData.name,
      icon: formData.icon || "fas fa-folder",
      description: formData.description || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-pp-secondary text-white border-pp-accent">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Add New Category</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-white p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="categoryName" className="block text-sm font-medium mb-2">
              Category Name
            </Label>
            <Input
              id="categoryName"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Forms"
              className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="categoryIcon" className="block text-sm font-medium mb-2">
              Icon (FontAwesome class)
            </Label>
            <Input
              id="categoryIcon"
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., fas fa-wpforms"
              className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange"
            />
          </div>
          
          <div>
            <Label htmlFor="categoryDescription" className="block text-sm font-medium mb-2">
              Description
            </Label>
            <Textarea
              id="categoryDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this category"
              className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={createCategoryMutation.isPending}
              className="flex-1 bg-pp-orange text-pp-dark hover:bg-orange-500 font-medium"
            >
              {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-pp-accent text-white hover:bg-gray-600 font-medium"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
