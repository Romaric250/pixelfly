import { ProjectDetails } from "@/components/projects/project-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificateTemplates } from "@/components/certificates/certificate-templates";
import { CertificateGenerator } from "@/components/certificates/certificate-generator";


export default function ProjectPage({ params }: { params: { projectId: string } }) {
    console.log("params here", params)
  const projectData = {
    id: params.projectId,
    name: "Project " + params.projectId,
    description: "This is a sample project description. Replace this with actual project data.",
    stats: {
      totalImages: 1234,
      certificates: 56,
      teamMembers: 12,
      storageUsed: "45.2 GB"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <ProjectDetails project={projectData} />

      <hr className="mt-4 mb-4" />

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
  )
}

