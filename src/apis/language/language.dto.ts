import { createZodDto } from '@anatine/zod-nestjs'
import { z } from 'zod'

const EditLanguageSchema = z.object({
  key: z.string(),
  value: z.string()
})

const EditQueryLanguageSchema = z.object({
  code: z.string().max(256).nullable().optional()
})
const FilterLanguageSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  code: z.string().max(256).nullable().optional(),
  key: z.string().max(256).nullable().optional(),
  value: z.string().max(256).nullable().optional()
})
export class EditLanguageDto extends createZodDto(EditLanguageSchema) {}
export class EditQueryLanguageDto extends createZodDto(EditQueryLanguageSchema) {}
export class FilterLanguageDto extends createZodDto(FilterLanguageSchema) {}
