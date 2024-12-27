"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificateTemplates } from "@/components/certificates/certificate-templates";
import { CertificateGenerator } from "@/components/certificates/certificate-generator";

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Certificate Management</h1>
      </div>
      
      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="generate">Generate Certificates</TabsTrigger>
        </TabsList>
        <TabsContent value="templates">
          <CertificateTemplates />
        </TabsContent>
        <TabsContent value="generate">
          <CertificateGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}