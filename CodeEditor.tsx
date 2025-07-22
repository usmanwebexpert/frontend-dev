import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Edit, Save, X } from "lucide-react";
import type { Component } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CodeEditorProps {
  selectedComponent: Component | null;
  onCloseComponent: () => void;
}

export default function CodeEditor({ selectedComponent, onCloseComponent }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [compiledCode, setCompiledCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState({
    html: "",
    css: "",
    js: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedComponent) {
      setEditedCode({
        html: selectedComponent.html,
        css: selectedComponent.css,
        js: selectedComponent.js
      });
      setIsEditing(false);
    }
  }, [selectedComponent]);

  useEffect(() => {
    if (selectedComponent) {
      // Compile the code for live preview
      const codeToUse = isEditing ? editedCode : selectedComponent;
      const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui; background: white; }
            ${codeToUse.css}
          </style>
        </head>
        <body>
          ${codeToUse.html}
          <script>
            try {
              ${codeToUse.js}
            } catch (e) {
              console.error('JS Error:', e);
            }
          </script>
        </body>
        </html>
      `;
      setCompiledCode(fullHTML);
    }
  }, [selectedComponent, editedCode, isEditing]);

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

  const updateComponentMutation = useMutation({
    mutationFn: async (updates: Partial<Component>) => {
      const response = await apiRequest("PUT", `/api/components/${selectedComponent?.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/components"] });
      toast({
        title: "Success!",
        description: "Component updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update component",
        variant: "destructive",
      });
    },
  });

  const getCurrentCode = () => {
    if (!selectedComponent) return "";
    const codeSource = isEditing ? editedCode : selectedComponent;
    switch (activeTab) {
      case "html":
        return codeSource.html;
      case "css":
        return codeSource.css;
      case "js":
        return codeSource.js;
      default:
        return "";
    }
  };

  const handleCodeChange = (value: string) => {
    setEditedCode(prev => ({
      ...prev,
      [activeTab]: value
    }));
  };

  const handleSave = () => {
    if (selectedComponent) {
      updateComponentMutation.mutate(editedCode);
    }
  };

  const handleCancelEdit = () => {
    if (selectedComponent) {
      setEditedCode({
        html: selectedComponent.html,
        css: selectedComponent.css,
        js: selectedComponent.js
      });
    }
    setIsEditing(false);
  };

  const highlightCode = (code: string, language: string) => {
    // Simple syntax highlighting
    let highlightedCode = code;
    
    if (language === "html") {
      highlightedCode = highlightedCode
        .replace(/(&lt;[^&]*&gt;)/g, '<span class="syntax-html">$1</span>')
        .replace(/(&lt;\/[^&]*&gt;)/g, '<span class="syntax-html">$1</span>')
        .replace(/(class=)"([^"]*)"/g, '$1"<span class="syntax-css">$2</span>"');
    } else if (language === "css") {
      highlightedCode = highlightedCode
        .replace(/([.#][a-zA-Z0-9_-]+)/g, '<span class="syntax-css">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syntax-comment">$1</span>');
    } else if (language === "js") {
      highlightedCode = highlightedCode
        .replace(/(\/\/.*$)/gm, '<span class="syntax-comment">$1</span>')
        .replace(/(function|const|let|var|if|else|for|while)/g, '<span class="syntax-js">$1</span>');
    }
    
    return highlightedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  if (!selectedComponent) {
    return (
      <div className="flex-1 flex flex-col bg-pp-dark">
        <div className="bg-pp-secondary border-b border-pp-accent px-4 py-2">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">Select a component to view its code</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="w-16 h-16 bg-pp-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-medium mb-2">No Component Selected</h3>
            <p className="text-sm">Choose a component from the library to view and edit its code</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-pp-dark">
      {/* Editor Tabs */}
      <div className="bg-pp-secondary border-b border-pp-accent px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {[
              { key: "html", label: "HTML", icon: "🌐" },
              { key: "css", label: "CSS", icon: "🎨" },
              { key: "js", label: "JS", icon: "⚡" },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "secondary"}
                size="sm"
                onClick={() => setActiveTab(tab.key as "html" | "css" | "js")}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-pp-orange text-pp-dark"
                    : "bg-pp-accent text-white hover:bg-gray-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-pp-orange hover:text-orange-400"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={updateComponentMutation.isPending}
                  className="text-green-400 hover:text-green-300"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {updateComponentMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCloseComponent}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor and Preview Split */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="w-1/2 bg-pp-dark flex flex-col">
          <div className="flex-1 p-4">
            <div className="bg-pp-secondary rounded-lg p-4 h-full overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-400">
                  {activeTab.toUpperCase()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(getCurrentCode())}
                  className="text-pp-orange hover:text-orange-400 text-sm p-1 h-auto"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              {isEditing ? (
                <Textarea
                  value={getCurrentCode()}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="font-code text-sm bg-pp-dark text-gray-300 border-none resize-none h-full min-h-[400px] focus:ring-2 focus:ring-pp-orange"
                  placeholder={`Enter ${activeTab.toUpperCase()} code here...`}
                />
              ) : (
                <div className="font-code text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(getCurrentCode(), activeTab),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resizer */}
        <div className="resizer bg-pp-accent hover:bg-pp-orange transition-colors w-1 cursor-col-resize"></div>

        {/* Live Preview */}
        <div className="w-1/2 bg-white flex flex-col">
          <div className="bg-pp-secondary p-3 border-b border-pp-accent">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-400">Live Preview</span>
              <div className="flex space-x-1 ml-auto">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 bg-gray-50">
            <div className="w-full h-full bg-white border border-gray-200 rounded overflow-auto">
              <div 
                dangerouslySetInnerHTML={{
                  __html: selectedComponent ? `
                    <style>
                      body { margin: 0; padding: 20px; font-family: system-ui; }
                      ${isEditing ? editedCode.css : selectedComponent.css}
                    </style>
                    ${isEditing ? editedCode.html : selectedComponent.html}
                    <script>
                      try {
                        ${isEditing ? editedCode.js : selectedComponent.js}
                      } catch (e) {
                        console.error('JS Error:', e);
                      }
                    </script>
                  ` : '<div style="padding: 20px; color: #666;">Select a component to see preview</div>'
                }}
                className="w-full h-full min-h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
