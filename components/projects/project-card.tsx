import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit2, Trash2, Check, X, ExternalLink } from 'lucide-react'
import Link from "next/link"

interface ProjectCardProps {
  project: { id: string; name: string; description: string }
  onDelete: (id: string) => void
  onUpdate: (id: string, name: string, description: string) => void
}

export function ProjectCard({ project, onDelete, onUpdate }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(project.name)
  const [editedDescription, setEditedDescription] = useState(project.description)

  const handleUpdate = () => {
    onUpdate(project.id, editedName, editedDescription)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedName(project.name)
    setEditedDescription(project.description)
    setIsEditing(false)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          {isEditing ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="font-bold"
            />
          ) : (
            project.name
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {isEditing ? (
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="min-h-[100px]"
          />
        ) : (
          <p className="text-muted-foreground">{project.description}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button variant="default" size="sm" onClick={handleUpdate}>
              <Check className="mr-2 h-4 w-4" /> Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(project.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/projects/${project.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" /> View Details
              </Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

