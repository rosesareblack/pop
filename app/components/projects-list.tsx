'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, FolderPlus, ArrowRight } from 'lucide-react'

interface Project {
  id: string
  name?: string
}

interface ProjectsListProps {
  projects: Project[]
}

export function NewProjectButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/projects/new">
        <FolderPlus className="w-4 h-4" />
        New Project
      </Link>
    </Button>
  )
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const router = useRouter()

  const handleNewChat = () => {
    router.push('/chats/new')
  }

  const getProjectTitle = (project: Project) => {
    if (project.name) return project.name
    return 'Untitled Project'
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">✨</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No projects yet
        </h2>
        <p className="text-gray-600 mb-6">Create your first AI-generated app</p>
        <Button onClick={handleNewChat} size="lg" className="mx-auto">
          <Plus className="w-5 h-5" />
          Create Project
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group block"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
                {getProjectTitle(project)}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
