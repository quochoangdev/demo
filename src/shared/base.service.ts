import { BadRequestException, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

export class BaseService implements OnModuleDestroy {
  protected readonly _prisma: PrismaClient
  protected readonly _transactionTimeOut = 30000
  protected readonly _tzOffset = new Date().getTimezoneOffset()

  constructor() {
    this._prisma = new PrismaClient({
      log: [{ emit: 'event', level: 'query' }]
    })
    // this._prisma.$on<any>('query', async (e: any) => {
    //   console.log(`${e.query} ${e.params}`)
    // })
  }

  protected withLimitOffset(query: IListQuery): { take: number; skip: number } {
    query.page = !query.page || Number.isNaN(query.page) ? 1 : +query.page
    query.pageSize = !query.pageSize || Number.isNaN(query.pageSize) ? 20 : +query.pageSize

    const skip = (query.page - 1) * query.pageSize
    return { take: query.pageSize, skip }
  }

  protected withPagination(data: Array<IRecord>, query: IListQuery, total?: number): IListDto {
    data.forEach((d) => {
      d.key = d.id
    })
    return {
      data,
      pagination: { page: query.page, pageSize: query.pageSize, total: total || data.length }
    }
  }

  onModuleDestroy() {
    this._prisma.$disconnect()
  }

  protected withBadRequest(message: any) {
    throw new BadRequestException({ message, error: 'Bad Request', statusCode: 400 })
  }
}
