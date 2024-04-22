import { FormButtonEnum, FormInputEnum } from '@/constants'
import { BaseService } from '@/shared/base.service'
import { Injectable, Logger } from '@nestjs/common'
import { FilterTrackingDto } from './tracking.dto'

@Injectable()
export class TrackingService extends BaseService {
  private readonly _logger: Logger = new Logger(TrackingService.name)
  async getTracking(query: FilterTrackingDto, userLogin: { id: string }) {
    const { skip, take } = this.withLimitOffset(query)
    const where = {} as Record<string, any>
    if (query.hostname) where.hostname = { contains: query.hostname }
    if (query.completed) where.completed = query.completed == 'true'
    const [result, count] = await Promise.all([
      this._prisma.sitesTracking.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'asc' }
      }),
      this._prisma.sitesTracking.count({ where })
    ])

    const { data, pagination } = this.withPagination(result, query, count)

    return {
      title: 'Trackings',
      pagination,
      data: data,
      header: [
        { name: 'hostname', title: 'Domain', align: 'left', width: '10%', type: 'string' },
        { name: 'forwardIp', title: 'Forward IP', align: 'left', width: '20%', type: 'string' },
        { name: 'realIp', title: 'RealIP', align: 'left', width: '20%', type: 'string' },
        { name: 'completed', title: 'Completed', align: 'center', width: '10%', type: 'switch', disabled: true },
        { name: 'userAgent', title: 'User Agent', align: 'left', width: '10%', type: 'string' },
        { name: 'createdAt', title: 'Date & time', align: 'center', width: '20%', type: 'date' }
      ],
      filters: [
        {
          type: FormInputEnum.INPUT,
          name: 'hostname',
          label: 'Domain',
          text: 'Search',
          placeholder: 'Search for domain'
        },
        {
          type: FormInputEnum.SELECT,
          name: 'completed',
          label: 'Completed',
          text: 'Completed',
          data: [
            { code: 'true', label: 'Completed' },
            { code: 'false', label: 'Pending' }
          ]
        }
      ],
      deleteInputs: [
        { type: FormInputEnum.INPUT, name: 'name', label: 'Name', disabled: true },
        { type: FormInputEnum.INPUT, name: 'email', label: 'Email', disabled: true },
        { type: FormInputEnum.CHECKBOX, name: 'emailVerified', label: 'emailVerified', disabled: true },
        { type: FormInputEnum.INPUT, name: 'createdAt', label: 'createdAt', disabled: true },
        { type: FormInputEnum.INPUT, name: 'updatedAt', label: 'updatedAt', disabled: true },
        { type: FormInputEnum.INPUT, name: 'deletedAt', label: 'deletedAt', disabled: true }
      ],

      deleteActions: [
        { text: 'Delete', type: FormButtonEnum.DELETE },
        { text: 'Cancel', type: FormButtonEnum.CLOSE }
      ]
    }
  }
}
