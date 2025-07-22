import { Component } from "@shared/schema";

export const sampleButtonComponents = [
  {
    name: "Primary Button",
    description: "Basic primary action button",
    html: `<button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
  Primary Button
</button>`,
    css: `.primary-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background-color: #2563eb;
}`,
    js: `// Add click handler
document.querySelector('.primary-btn').addEventListener('click', function() {
  console.log('Primary button clicked!');
});`,
    tags: ["primary", "basic", "blue"]
  },
  {
    name: "Outline Button",
    description: "Secondary action style button",
    html: `<button class="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
  Secondary Button
</button>`,
    css: `.outline-btn {
  border: 2px solid #d1d5db;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  background: transparent;
  transition: border-color 0.2s;
}

.outline-btn:hover {
  border-color: #9ca3af;
}`,
    js: `// Add hover effect
const btn = document.querySelector('.outline-btn');
btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.02)');
btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');`,
    tags: ["secondary", "outline", "gray"]
  },
  {
    name: "Gradient Icon Button",
    description: "Eye-catching CTA with icon",
    html: `<button class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all">
  <i class="fas fa-star mr-2"></i>
  Gradient Button
</button>`,
    css: `.gradient-btn {
  background: linear-gradient(to right, #8b5cf6, #ec4899);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.gradient-btn:hover {
  background: linear-gradient(to right, #7c3aed, #db2777);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}`,
    js: `// Add click animation
document.querySelector('.gradient-btn').addEventListener('click', function() {
  this.style.transform = 'scale(0.98)';
  setTimeout(() => {
    this.style.transform = 'translateY(-1px)';
  }, 150);
});`,
    tags: ["gradient", "icon", "cta", "animated"]
  }
];

export const generateSampleComponents = (categoryId: number, categoryName: string): Partial<Component>[] => {
  if (categoryName.toLowerCase() === 'buttons') {
    return sampleButtonComponents.map(comp => ({
      ...comp,
      categoryId,
      isActive: true
    }));
  }
  
  // For other categories, generate basic sample components
  const samples = [
    {
      name: `Basic ${categoryName.slice(0, -1)}`,
      description: `Simple ${categoryName.toLowerCase().slice(0, -1)} component`,
      html: `<div class="sample-${categoryName.toLowerCase()}">
  <!-- ${categoryName} content here -->
  <p>Sample ${categoryName.slice(0, -1)} Component</p>
</div>`,
      css: `.sample-${categoryName.toLowerCase()} {
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  color: #374151;
}`,
      js: `// Add interactivity
console.log('${categoryName} component loaded');`,
      tags: ["basic", categoryName.toLowerCase()]
    }
  ];
  
  return samples.map(comp => ({
    ...comp,
    categoryId,
    isActive: true
  }));
};
