"use client";
import { Toast } from "@/components/ui/toast";

// Type definitions
export interface Template {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  fields: Field[];
  created_at: string;
}

export interface Field {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "text" | "date" | "image";
}

// Storage keys
const TEMPLATES_KEY = 'certificate_templates';

// Helper functions
export function getTemplates(): Template[] {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveTemplate(template: Template) {
  const templates = getTemplates();
  templates.push(template);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
//   window.location.reload()
}

export function updateTemplate(id: string, updates: Partial<Template>) {
  const templates = getTemplates();
  const index = templates.findIndex(t => t.id === id);
  if (index !== -1) {
    templates[index] = { ...templates[index], ...updates };
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }
}

export function getTemplate(id: string): Template | null {
  const templates = getTemplates();
  return templates.find(t => t.id === id) || null;
}

export function deleteTemplate(id: string) {
  const templates = getTemplates();
  const filtered = templates.filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
  window.location.reload()


}