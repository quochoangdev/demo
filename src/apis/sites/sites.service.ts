import { FormButtonEnum, FormInputEnum } from '@/constants'
import { BaseService } from '@/shared/base.service'
import { getDateTime } from '@/shared/util'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CreateSiteDto, FilterSitesDto, UpdateSiteDto } from './sites.dto'
//
@Injectable()
export class SitesService extends BaseService {
  private readonly _logger: Logger = new Logger(SitesService.name)

  async getSiteViewToday(id: string) {
    const today = getDateTime(7)
    const startOfDay = new Date(today.date + 'T00:00:00Z')
    const endOfDay = new Date(today.date + 'T23:59:59.999Z')

    const summaryData = await this._prisma.$queryRaw<Array<Record<string, string>>>(
      Prisma.sql`
            SELECT COUNT(*)::text as count, s.* as "site"
            FROM sites_tracking st
            JOIN
            sites s ON st.site_id = s.id
            WHERE st.site_id = ${id} AND st.created_at BETWEEN ${startOfDay.toISOString()}::timestamp AND ${endOfDay.toISOString()}::timestamp
            GROUP BY st.site_id, s.id;
            `
    )
    return summaryData[0]
  }

  async findSites(query: FilterSitesDto, userLogin: { id: string }) {
    const { skip, take } = this.withLimitOffset(query)
    const where = { deletedAt: null } as Record<string, any>

    if (query.name) where.name = { contains: query.name }
    if (query.status) where.status = query.status
    const [result, count] = await Promise.all([
      this._prisma.sites.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { user: {} } }),
      this._prisma.sites.count({ where })
    ])

    const { data, pagination } = this.withPagination(result, query, count)

    return {
      title: 'All Sites',
      pagination,
      data: data.map((d: any) => ({
        ...d,
        active: d.status == 'ACTIVE'
      })),
      header: [
        { name: 'name', title: 'Domain', align: 'left', type: 'string', redirect: true },
        { name: 'active', title: 'Active', align: 'center', width: '10%', type: 'switch' },
        { name: 'point', title: 'Point', align: 'center', width: '10%', type: 'string' },
        { name: 'time', title: 'Time', align: 'center', width: '10%', type: 'string' },
        { name: 'view', title: 'View', align: 'center', width: '10%', type: 'string' },
        { name: 'createdAt', title: 'Created Time', align: 'center', width: '20%', type: 'date' },
        { name: 'updatedAt', title: 'Updated Time', align: 'center', width: '20%', type: 'date' },
        { name: 'deletedAt', title: 'Deleted Time', align: 'center', width: '20%', type: 'date' },
        { name: 'action_delete', align: 'right', width: '10%', type: 'action' }
      ],
      filters: [
        { type: FormInputEnum.INPUT, name: 'name', label: 'Website', text: 'Search', placeholder: 'Search for sites' },
        {
          type: FormInputEnum.SELECT,
          name: 'status',
          label: 'Status',
          text: 'Status',
          placeholder: 'Status',
          data: [
            { code: 'INACTIVE', label: 'Inactive' },
            { code: 'ACTIVE', label: 'Active' }
          ]
        }
      ],
      createInputs: [
        { type: FormInputEnum.INPUT, name: 'name', label: 'Website', placeholder: 'xmantraffic.com' },
        { type: FormInputEnum.NUMBER, name: 'point', label: 'Point', placeholder: '3' },
        { type: FormInputEnum.NUMBER, name: 'time', label: 'Time', placeholder: 'timing...' },
        { type: FormInputEnum.NUMBER, name: 'view', label: 'Show bonus after number of views' },
        { type: FormInputEnum.SWITCH, name: 'active', label: 'Active', defaultValue: false }
      ],
      deleteInputs: [
        { type: FormInputEnum.INPUT, name: 'name', label: 'Website', disabled: true },
        { type: FormInputEnum.NUMBER, name: 'point', label: 'Point', disabled: true },
        { type: FormInputEnum.NUMBER, name: 'time', label: 'Time', disabled: true },
        { type: FormInputEnum.NUMBER, name: 'point', label: 'point', disabled: true },
        { type: FormInputEnum.SWITCH, name: 'active', label: 'Active', disabled: true }
      ],

      createActions: [
        { text: 'Add', type: FormButtonEnum.ADD },
        { text: 'Cancel', type: FormButtonEnum.CLOSE }
      ],

      deleteActions: [
        { text: 'Delete', type: FormButtonEnum.DELETE },
        { text: 'Cancel', type: FormButtonEnum.CLOSE }
      ]
    }
  }

  async getRecommendedSite(userId: string) {
    const [site] = await this._prisma.$queryRaw<Array<Prisma.SitesCreateInput>>(
      Prisma.sql`select * from sites s 
        where s.status = 'ACTIVE' order by random() limit 1;`
    )
    const siteReport = await this.getSiteViewToday(site.id)
    return { ...siteReport, ...site, name: 'https://' + site.name }
  }

  async createSites(body: CreateSiteDto, userLogin: { id: string }) {
    const isSiteExist = await this._prisma.sites.findFirst({
      where: { name: body.name, userId: userLogin.id, deletedAt: null }
    })
    if (isSiteExist) throw new BadRequestException('ERROR_SITE_EXIST')
    const result = await this._prisma.sites.create({
      data: {
        name: body?.name,
        status: Boolean(body?.active) ? 'ACTIVE' : 'INACTIVE',
        createdAt: new Date(),
        createdBy: userLogin.id,
        userId: userLogin.id
      }
    })
    return result
  }

  async updateSites(id: string, body: UpdateSiteDto, userLogin: IUserLogin) {
    const isSiteExist = await this._prisma.sites.findFirst({ where: { id: id, deletedAt: null } })
    if (!isSiteExist) throw new BadRequestException('ERROR_SITE_NOT_FOUND')
    const result = await this._prisma.sites.update({
      where: { id: id },
      data: {
        status: Boolean(body?.active) ? 'ACTIVE' : 'INACTIVE',
        updatedAt: new Date(),
        updatedBy: userLogin.id
      }
    })

    return {
      ...result,
      active: result.status == 'ACTIVE'
    }
  }

  async deleteSites(id: string, userLogin: { id: string }) {
    const isSiteExist = await this._prisma.sites.findFirst({ where: { id: id, deletedAt: null } })
    if (!isSiteExist) throw new BadRequestException('ERROR_SITE_NOT_FOUND')
    await this._prisma.sites.update({
      where: { id: id, deletedAt: null },
      data: { deletedAt: new Date(), deletedBy: userLogin.id }
    })
    return true
  }
}
