import { defineEventHandler } from 'h3'
import { getDefaultProject } from '../../utils/project-api'

export default defineEventHandler(() => getDefaultProject())
