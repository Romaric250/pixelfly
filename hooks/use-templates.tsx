"use client";

import { useState, useEffect } from "react";
import { Template } from "@/lib/local-storage";
import * as storage from "@/lib/local-storage";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load templates from localStorage
    const loadedTemplates = storage.getTemplates();
    setTemplates(loadedTemplates);
    setLoading(false);
  }, []);

  const addTemplate = (template: Template) => {
    storage.saveTemplate(template);
    setTemplates(prev => [...prev, template]);
  };

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    storage.updateTemplate(id, updates);
    setTemplates(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const deleteTemplate = (id: string) => {
    storage.deleteTemplate(id);
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  return { 
    templates, 
    loading,
    addTemplate,
    updateTemplate,
    deleteTemplate
  };
}

export function useTemplate(id: string) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedTemplate = storage.getTemplate(id);
    setTemplate(loadedTemplate);
    setLoading(false);
  }, [id]);

  const updateFields = (fields: Template['fields']) => {
    if (template) {
      const updated = { ...template, fields };
      storage.updateTemplate(template.id, updated);
      setTemplate(updated);
    }
  };

  return { 
    template, 
    loading,
    updateFields
  };
}