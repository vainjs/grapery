import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export type GrapesProject = Record<string, unknown>

export interface StoredProject {
  project: GrapesProject
  updatedAt: string | null
}

export const defaultProject: GrapesProject = {
  pages: [
    {
      id: 'home',
      name: 'Home',
      component:
        '<main style="min-height:100vh;display:grid;place-items:center;padding:48px 24px;font-family:Inter,system-ui,sans-serif;background:#f8fafc"><section style="max-width:720px;text-align:center"><p style="color:#6366f1;font-weight:700;letter-spacing:.12em">GRAPERY</p><h1 style="margin:16px 0;color:#0f172a;font-size:64px;line-height:1">构建你的页面</h1><p style="color:#475569;font-size:18px;line-height:1.7">拖入区块、调整属性与样式，然后保存项目。</p></section></main>',
    },
  ],
}

export function projectFilePath() {
  return join(process.cwd(), '.data', 'projects', 'default.json')
}

export function validateProject(project: unknown): asserts project is GrapesProject {
  if (project === null || typeof project !== 'object' || Array.isArray(project)) {
    throw new TypeError('project must be an object')
  }
}

export async function readProject(filePath = projectFilePath()): Promise<StoredProject> {
  try {
    const [contents, metadata] = await Promise.all([readFile(filePath, 'utf8'), stat(filePath)])
    const project: unknown = JSON.parse(contents)
    validateProject(project)

    return {
      project,
      updatedAt: metadata.mtime.toISOString(),
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return { project: defaultProject, updatedAt: null }
    }

    throw error
  }
}

export async function saveProject(project: unknown, filePath = projectFilePath()): Promise<{ updatedAt: string }> {
  validateProject(project)

  const directory = dirname(filePath)
  const temporaryPath = join(directory, `.default-${randomUUID()}.tmp`)
  await mkdir(directory, { recursive: true })

  try {
    await writeFile(temporaryPath, `${JSON.stringify(project, null, 2)}\n`, 'utf8')
    await rename(temporaryPath, filePath)
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined)
    throw error
  }

  const metadata = await stat(filePath)
  return { updatedAt: metadata.mtime.toISOString() }
}
