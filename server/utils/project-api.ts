import { createError } from 'h3'
import { readProject, saveProject, validateProject, type GrapesProject, type StoredProject } from './project-store'

type ReadProject = () => Promise<StoredProject>
type SaveProject = (project: GrapesProject) => Promise<{ updatedAt: string }>

export function getDefaultProject(read: ReadProject = readProject): Promise<StoredProject> {
  return read()
}

export async function saveDefaultProject(
  payload: unknown,
  save: SaveProject = saveProject,
): Promise<{ updatedAt: string }> {
  const project =
    payload && typeof payload === 'object' && !Array.isArray(payload) && 'project' in payload
      ? payload.project
      : undefined

  try {
    validateProject(project)
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'project must be an object',
    })
  }

  return save(project)
}
