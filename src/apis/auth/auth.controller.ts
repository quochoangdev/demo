import { Locker } from '@/shared/app.lock'
import { Public } from '@/shared/util'
import { Body, Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignInGoogleDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly appLock: Locker,
    private readonly jwtService: JwtService
  ) {}

  @Public()
  @Post('sign-in')
  async signInGoogle(@Body() body: SignInGoogleDto) {
    const lockName = `${body.username}`
    try {
      await this.appLock.lock(lockName)

      const payload = await this.service.signIn(body.username.trim(), body.password)
      if (payload === null) {
        throw new UnauthorizedException()
      }

      return {
        token: await this.jwtService.signAsync(payload, {
          secret: process.env.LANDING_SECRET_TOKEN || 'RIKI_LANDING_SECRET_TOKEN'
        }),
        username: payload.username
      }
    } catch (e) {
      throw new UnauthorizedException(e.message)
    } finally {
      this.appLock.release(lockName)
    }
  }
}
