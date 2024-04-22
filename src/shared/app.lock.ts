import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

@Injectable()
export class Locker implements OnModuleDestroy {
  protected readonly _prisma: PrismaClient

  constructor() {
    this._prisma = new PrismaClient({})
  }

  onModuleDestroy() {
    this._prisma.$disconnect()
  }

  async lock(lockName: string) {
    const key = this.strToKey(lockName)
    await this._prisma.$queryRaw(Prisma.sql`SELECT pg_try_advisory_lock(${this.strToKey(lockName)}) "lockObtained"`)
  }

  async release(lockName: string) {
    await this._prisma.$queryRaw(Prisma.sql`SELECT pg_advisory_unlock(${this.strToKey(lockName)}) "lockReleased"`)
  }

  private strToKey(key: string) {
    // Generate sha256 hash of name
    // and take 32 bit twice from hash
    const buf = createHash('sha256').update(key).digest()
    // Read the first 4 bytes and the next 4 bytes
    // The parameter here is the byte offset, not the sizeof(int32) offset
    return BigInt([buf.readUint16BE(0), buf.readUint16BE(4), buf.readUint16BE(8)].join(''))
  }
}
