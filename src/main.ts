import 'dotenv/config'

import { Logger } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Server } from 'net'
import { AppModule } from './app.module'
import { CacheInterceptor } from './interceptors/cache.interceptor'

const logger = new Logger()

async function startApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.setGlobalPrefix('api')
  app.enableCors()
  app.useGlobalInterceptors(new CacheInterceptor(app.get(Reflector)))

  const config = new DocumentBuilder().setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  const server: Server = await app.listen(5051, '0.0.0.0')
  server.setMaxListeners(0)
  logger.log('Application is running at http://0.0.0.0:5051')
}

async function bootstrap() {
  const env = process.env.NODE_ENV
  if (env && env !== 'development') {
    const { exec } = await import('child_process')
    exec('yarn prisma migrate deploy', { env: process.env }, async (error, stdout) => {
      if (error) {
        logger.error(error)
        return
      }
      logger.log(stdout)
      await startApp()
    })
  } else {
    await startApp()
  }
}

bootstrap()
