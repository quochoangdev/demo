import { Pagination } from '@/dto'
import { createZodDto } from '@anatine/zod-nestjs'
import { IsOptional } from 'class-validator'
import { z } from 'zod'

export class FilterTrackingDto extends Pagination {
  @IsOptional()
  hostname?: string

  @IsOptional()
  completed?: string
}
