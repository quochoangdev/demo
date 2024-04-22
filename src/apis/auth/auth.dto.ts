import { createZodDto } from '@anatine/zod-nestjs'
import { z } from 'zod'

const SignInGoogleSchema = z.object({ username: z.string(), password: z.string() })
export class SignInGoogleDto extends createZodDto(SignInGoogleSchema) {}
