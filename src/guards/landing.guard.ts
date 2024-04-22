import { IS_PUBLIC_KEY } from '@/shared/util'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

import type { Request } from 'express'

export const LANDING_APP_GUARD = 'LANDING_APP_GUARD'

@Injectable()
export class LandingAuthGuard implements CanActivate {
  private readonly _secret: string
  constructor(private jwtService: JwtService, private reflector: Reflector) {
    this._secret = process.env.LANDING_SECRET_TOKEN || 'RIKI_LANDING_SECRET_TOKEN'
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) return true

    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: this._secret })
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['admin-user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
