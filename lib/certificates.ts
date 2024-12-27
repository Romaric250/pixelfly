"use client";

import { Template, Field } from './local-storage';

// Example API request payload for certificate generation
interface CertificateGenerationPayload {
  templateId: string;
  template: {
    imageUrl: string;
    width: number;
    height: number;
    fields: Array<{
      id: string;
      type: "text" | "date" | "image";
      x: number;
      y: number;
      width: number;
      height: number;
      value: string;
    }>;
  };
  data: Array<{
    name: string;
    date?: string;
    image?: string;
    [key: string]: string | undefined;
  }>;
}

export async function uploadTemplate(file: File): Promise<Template> {
  // Create blob URL
  const url = URL.createObjectURL(file);
  
  // Get image dimensions
  const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.src = url;
  });
  
  // Create template object
  const template: Template = {
    id: crypto.randomUUID(),
    name: file.name,
    url,
    width: dimensions.width,
    height: dimensions.height,
    fields: [],
    created_at: new Date().toISOString()
  };

  return template;
}

export async function generateCertificates(
  templateId: string, 
  template: Template,
  data: Array<{ [key: string]: string }>
): Promise<Blob> {
  // Prepare payload for Python API
  const payload: CertificateGenerationPayload = {
    templateId,
    template: {
      imageUrl: template.url,
      width: template.width,
      height: template.height,
      fields: template.fields.map(field => ({
        ...field,
        value: `{{${field.id}}}` // Template placeholder
      }))
    },
    data: data.map(item => ({
      ...item,
      name: item.name || 'Unknown', // Ensure name is included
      date: new Date().toISOString() // Add current date if needed
    }))
  };

  // Call Python API
  const response = await fetch('/api/certificates/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to generate certificates');
  }

  return response.blob();
}