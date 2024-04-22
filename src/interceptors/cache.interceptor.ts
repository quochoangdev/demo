import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  OnModuleDestroy,
  SetMetadata,
  StreamableFile
} from '@nestjs/common'
import { isNil } from '@nestjs/common/utils/shared.utils'
import { Reflector } from '@nestjs/core'
import { RedisClientType, createClient } from '@redis/client'
import { Observable, of, tap } from 'rxjs'

import type { Request } from 'express'

export const IS_IGNORE_KEY = 'isIgnore'
export const IgnoreCache = () => SetMetadata(IS_IGNORE_KEY, true)

@Injectable()
export class CacheInterceptor implements NestInterceptor, OnModuleDestroy {
  private readonly _allowedMethods = ['GET']
  private readonly _distributedStore: RedisClientType
  private readonly _memoryStore: Map<string, unknown>
  private readonly _keysManager: string[] = []
  private readonly _ttl: number = parseInt(process.env.REDIS_TTL || '30000')

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private _useMemory: boolean = true

  constructor(private reflector: Reflector) {
    if (process.env.REDIS_HOST) {
      this._distributedStore = createClient({ url: process.env.REDIS_HOST })
      this._distributedStore.connect()
      this._useMemory = false
    } else {
      this._memoryStore = new Map()
    }
  }

  onModuleDestroy() {
    this._distributedStore?.disconnect()
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>()

    const key = req.url
    if (this._allowedMethods.includes(req.method)) {
      const isIgnore = this.reflector.getAllAndOverride<boolean>(IS_IGNORE_KEY, [
        context.getHandler(),
        context.getClass()
      ])
      if (isIgnore) {
        return next.handle()
      }

      const value = await this.get(key)
      if (!isNil(value)) {
        return of(value)
      } else {
        return next.handle().pipe(
          tap(async (response) => {
            if (response instanceof StreamableFile) {
              return
            }
            try {
              await this.set(key, response)
            } catch (err) {
              Logger.error(
                `An error has occurred when inserting "key: ${key}", "value: ${response}"`,
                'CacheInterceptor'
              )
            }
          })
        )
      }
    } else {
      setTimeout(() => {
        const rootPath = req.url.split('/')
        const resourcePath = rootPath[1]
        this._keysManager
          .filter((k) => k.includes(resourcePath))
          .forEach((k) => {
            this.remove(k)
          })
      }, 0)
      return next.handle()
    }
  }

  private async get(key: string) {
    return this._useMemory ? this._memoryStore.get(key) : await this._distributedStore.GET(key)
  }

  private async set(key: string, value: unknown) {
    this._keysManager.push(key)
    if (this._useMemory) {
      this._memoryStore.set(key, value)
      setTimeout(() => this.remove(key), this._ttl)
    } else {
      await this._distributedStore.PSETEX(key, this._ttl, JSON.stringify(value || 0))
    }
  }

  private async remove(key: string) {
    const keyIdx = this._keysManager.findIndex((k) => k === key)
    if (keyIdx >= 0) {
      this._keysManager.splice(keyIdx, 1)
    }
    if (this._useMemory) {
      this._memoryStore.delete(key)
    } else {
      await this._distributedStore.DEL(key)
    }
  }
}
