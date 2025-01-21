import { ProjectsOverview } from "@/components/projects/projects-overview"

export default function Page() {
  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-2">Projects</h1>
      <hr />
      <ProjectsOverview />
    </div>
  )
}

