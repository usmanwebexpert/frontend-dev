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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertComponent, Category } from "@shared/schema";

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  defaultCategoryId?: number;
}

export default function AddComponentModal({ 
  isOpen, 
  onClose, 
  categories, 
  defaultCategoryId 
}: AddComponentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: defaultCategoryId || categories[0]?.id || 1,
    html: "",
    css: "",
    js: "",
    tags: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createComponentMutation = useMutation({
    mutationFn: async (data: InsertComponent) => {
      const response = await apiRequest("POST", "/api/components", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/components"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success!",
        description: "Component created successfully",
      });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create component",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: defaultCategoryId || categories[0]?.id || 1,
      html: "",
      css: "",
      js: "",
      tags: "",
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Component name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.html.trim()) {
      toast({
        title: "Error",
        description: "HTML code is required",
        variant: "destructive",
      });
      return;
    }
    
    const tags = formData.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    createComponentMutation.mutate({
      name: formData.name,
      description: formData.description || undefined,
      categoryId: formData.categoryId,
      html: formData.html,
      css: formData.css,
      js: formData.js,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-pp-secondary text-white border-pp-accent max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Add New Component</DialogTitle>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="componentName" className="block text-sm font-medium mb-2">
                Component Name
              </Label>
              <Input
                id="componentName"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Animated Button"
                className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="componentCategory" className="block text-sm font-medium mb-2">
                Category
              </Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) => setFormData({ ...formData, categoryId: parseInt(value) })}
              >
                <SelectTrigger className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-pp-accent border-pp-accent">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id.toString()}
                      className="text-white hover:bg-pp-orange hover:text-pp-dark"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="componentDescription" className="block text-sm font-medium mb-2">
              Description
            </Label>
            <Input
              id="componentDescription"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the component"
              className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange"
            />
          </div>
          
          <div>
            <Label htmlFor="componentTags" className="block text-sm font-medium mb-2">
              Tags (comma-separated)
            </Label>
            <Input
              id="componentTags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="primary, hover, animation"
              className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange"
            />
          </div>
          
          <div>
            <Label htmlFor="componentHtml" className="block text-sm font-medium mb-2">
              HTML Code *
            </Label>
            <Textarea
              id="componentHtml"
              value={formData.html}
              onChange={(e) => setFormData({ ...formData, html: e.target.value })}
              placeholder="<button class='btn'>Click me</button>"
              className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange font-code text-sm resize-none"
              rows={4}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="componentCss" className="block text-sm font-medium mb-2">
              CSS Code
            </Label>
            <Textarea
              id="componentCss"
              value={formData.css}
              onChange={(e) => setFormData({ ...formData, css: e.target.value })}
              placeholder=".btn { padding: 10px 20px; background: #007bff; }"
              className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange font-code text-sm resize-none"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="componentJs" className="block text-sm font-medium mb-2">
              JavaScript Code
            </Label>
            <Textarea
              id="componentJs"
              value={formData.js}
              onChange={(e) => setFormData({ ...formData, js: e.target.value })}
              placeholder="document.querySelector('.btn').addEventListener('click', ...)"
              className="w-full bg-pp-accent text-white border-none focus:ring-2 focus:ring-pp-orange font-code text-sm resize-none"
              rows={4}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={createComponentMutation.isPending}
              className="flex-1 bg-pp-orange text-pp-dark hover:bg-orange-500 font-medium"
            >
              {createComponentMutation.isPending ? "Creating..." : "Add Component"}
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
