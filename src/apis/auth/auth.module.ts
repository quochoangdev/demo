import { LandingAuthGuard } from '@/guards/landing.guard'
import { Locker } from '@/shared/app.lock'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [JwtModule.register({ signOptions: { expiresIn: '30d' } })],
  controllers: [AuthController],
  providers: [{ provide: APP_GUARD, useClass: LandingAuthGuard }, AuthService, Locker]
})
export class AuthModule {}
