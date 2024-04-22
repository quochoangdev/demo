import { IsIP, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator'
import { Request } from 'express'

export class Pagination {
  @IsOptional()
  page: number

  @IsOptional()
  pageSize: number
}

export interface AuthRequest extends Request {
  user: { id: string }
}

export class IPDto {
  @IsIP()
  @IsNotEmpty()
  ip: string

  @Max(60000)
  @Min(5000)
  @IsNumber()
  @IsNotEmpty()
  port: number
}
