"use client"

import { useState } from "react"
import { ProjectCard } from "./project-card"
import { CreateProjectDialog } from "./create-project-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'

// Placeholder for server action
const createProject = async (name: string, description: string) => {
  // This will be replaced with an actual server action later
  console.log("Creating project:", name, description)
  return { id: Date.now().toString(), name, description }
}

// Placeholder for server action
const deleteProject = async (id: string) => {
  // This will be replaced with an actual server action later
  console.log("Deleting project:", id)
}

// Placeholder for server action
const updateProject = async (id: string, name: string, description: string) => {
  // This will be replaced with an actual server action later
  console.log("Updating project:", id, name, description)
}

export function ProjectsOverview() {
  const [projects, setProjects] = useState<Array<{ id: string; name: string; description: string }>>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateProject = async (name: string, description: string) => {
    const newProject = await createProject(name, description)
    setProjects([...projects, newProject])
    setIsCreateDialogOpen(false)
  }

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id)
    setProjects(projects.filter(project => project.id !== id))
  }

  const handleUpdateProject = async (id: string, name: string, description: string) => {
    await updateProject(id, name, description)
    setProjects(projects.map(project => project.id === id ? { ...project, name, description } : project))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2 mt-2">
        <h2 className="text-2xl font-semibold"></h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">You haven't created any projects yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
              onUpdate={handleUpdateProject}
            />
          ))}
        </div>
      )}
      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  )
}

