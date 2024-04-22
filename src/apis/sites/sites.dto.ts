import { Pagination } from '@/dto'
import { IsEnum, IsNotEmpty, MaxLength, IsOptional } from 'class-validator'
//
enum SiteStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export class FilterSitesDto extends Pagination {
  @IsOptional()
  name?: string

  @IsEnum(SiteStatus)
  @IsOptional()
  status?: SiteStatus
}
export class CreateSiteDto {
  @IsNotEmpty()
  @MaxLength(256)
  name: string

  active: string
}

export class UpdateSiteDto {
  @MaxLength(256)
  name: string

  active: string
}
