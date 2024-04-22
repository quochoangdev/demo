import type { Request, Response } from 'express'
import DailyRotateFile from 'winston-daily-rotate-file'
import { ZodValidationPipe } from '@anatine/zod-nestjs'
import {
  Inject,
  Injectable,
  Logger,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston'
import { format } from 'winston'
import { AuthModule } from './apis/auth/auth.module'
import { LanguageModule } from './apis/language/language.module'
import { SitesModule } from './apis/sites/sites.module'
import { TrackingModule } from './apis/tracking/tracking.module'
import { UsersModule } from './apis/users/users.module'
import { JwtModule } from '@nestjs/jwt'
import { AdminModule } from './apis/admin/admin.module'

const MODIFIABLE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']
const BASIC_METHODS = MODIFIABLE_METHODS.concat(['GET'])

@Injectable()
class LoggerMiddleware implements NestMiddleware {
  private readonly nestLogger = new Logger(LoggerMiddleware.name)
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly fileLogger: Logger) {}

  use(req: Request, res: Response, next: () => any) {
    const start = Date.now()
    const isModifiable = MODIFIABLE_METHODS.includes(req.method)
    if (isModifiable && !req.body) {
      req.body = {}
    }

    res.on('close', async () => {
      if (req.originalUrl.startsWith('/static')) {
        return
      }

      if (BASIC_METHODS.includes(req.method)) {
        const message = `${req.ip} ${req.method} ${req.originalUrl} (${Date.now() - start} ms) ${res.statusCode}`
        this.fileLogger.verbose(message)
        this.nestLogger.log(message)
      }
    })
    next()
  }
}

@Module({
  imports: [
    AuthModule,
    AdminModule,
    TrackingModule,
    SitesModule,
    UsersModule,
    LanguageModule,
    JwtModule.register({ global: true, signOptions: { expiresIn: '30d' } }),
    ScheduleModule.forRoot(),
    WinstonModule.forRoot({
      format: format.json(),
      transports: [
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          level: 'error'
        }),
        new DailyRotateFile({
          filename: 'logs/request-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          level: 'verbose'
        })
      ]
    })
  ],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
