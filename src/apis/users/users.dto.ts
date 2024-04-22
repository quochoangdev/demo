import { Pagination } from '@/dto'
import { createZodDto } from '@anatine/zod-nestjs'
import { IsOptional } from 'class-validator'
import { z } from 'zod'

export const UserSchema = z.object({
  email: z.string().max(100).email().nonempty(),
  name: z.string().max(256).nullable().optional(),
  locale: z.string().nullable().optional(),
  picture: z.string().max(1024).nullable().optional(),
  emailVerified: z.boolean().nullable().optional(),
  iss: z.string().max(1024).nullable().optional(),
  aud: z.string().max(1024).nullable().optional()
})

export const UpdateUserSchema = z.object({
  name: z.string().max(256).nullable().optional(),
  locale: z.string().nullable().optional(),
  picture: z.string().max(1024).nullable().optional(),
  emailVerified: z.boolean().nullable().optional(),
  iss: z.string().max(1024).nullable().optional(),
  aud: z.string().max(1024).nullable().optional()
})

export class FilterUserDto extends Pagination {
  @IsOptional()
  name?: string

  @IsOptional()
  emailVerified?: string

  @IsOptional()
  email?: string
}

export class CreateUserDto extends createZodDto(UserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
