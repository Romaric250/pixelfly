import { Template, Field } from './local-storage';

export async function uploadTemplate(file: File): Promise<Template> {
  // Create blob URL
  const url = URL.createObjectURL(file);
  
  // Create template object
  const template: Template = {
    id: crypto.randomUUID(),
    name: file.name,
    url,
    fields: [],
    created_at: new Date().toISOString()
  };

  return template;
}

export async function saveTemplateFields(templateId: string, fields: Field[]) {
  // This will be handled by the hooks
  return Promise.resolve();
}

export async function generateCertificates(templateId: string, data: string[]) {
  // Call your Python API endpoint
  const response = await fetch('/api/certificates/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      templateId,
      data
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate certificates');
  }

  return response.blob();
}