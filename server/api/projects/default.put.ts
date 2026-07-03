import { defineEventHandler, readBody } from 'h3'
import { saveDefaultProject } from '../../utils/project-api'

export default defineEventHandler(async (event) => {
  const payload: unknown = await readBody(event)
  return saveDefaultProject(payload)
})
