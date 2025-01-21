import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Image, Award, Users, HardDrive } from 'lucide-react'

interface ProjectStats {
  totalImages: number
  certificates: number
  teamMembers: number
  storageUsed: string
}

interface ProjectData {
  id: string
  name: string
  description: string
  stats: ProjectStats
}

interface ProjectDetailsProps {
  project: ProjectData
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const stats = [
    { name: 'Total Images', value: project.stats.totalImages, icon: Image },
    { name: 'Certificates', value: project.stats.certificates, icon: Award },
    { name: 'Team Members', value: project.stats.teamMembers, icon: Users },
    { name: 'Storage Used', value: project.stats.storageUsed, icon: HardDrive },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
      <p className="text-xl text-muted-foreground mb-8">{project.description}</p>
      
      <h2 className="text-2xl font-semibold mb-4">Project Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

