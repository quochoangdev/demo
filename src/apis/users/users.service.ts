import { BaseService } from '@/shared/base.service'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { CreateUserDto, FilterUserDto, UpdateUserDto } from './users.dto'
import { FormInputEnum, FormButtonEnum } from '@/constants'

@Injectable()
export class UsersService extends BaseService {
  private readonly _logger: Logger = new Logger(UsersService.name)
  async findUsers(query: FilterUserDto, userLogin: { id: string }) {
    const { skip, take } = this.withLimitOffset(query)
    const where = { deletedAt: null } as Record<string, any>

    if (query.name) where.name = { contains: query.name }
    if (query.emailVerified) where.emailVerified = query.emailVerified == 'true'
    if (query.email) where.email = { contains: query.email }

    const [result, count] = await Promise.all([
      this._prisma.users.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this._prisma.users.count({ where })
    ])

    const { data, pagination } = this.withPagination(result, query, count)

    return {
      title: 'All User',
      pagination,
      data: data,
      header: [
        { name: 'id', title: 'ID', align: 'left', type: 'string' },
        { name: 'name', title: 'name', align: 'left', width: '10%', type: 'string' },
        { name: 'email', title: 'Email', align: 'left', width: '10%', type: 'string' },
        { name: 'emailVerified', title: 'Verify', align: 'center', width: '10%', type: 'switch', disabled: false },
        { name: 'createdAt', title: 'Created Time', align: 'center', width: '20%', type: 'date' },
        { name: 'updatedAt', title: 'Updated Time', align: 'center', width: '20%', type: 'date' },
        { name: 'action_delete', title: 'Delete', align: 'center', width: '10%', type: 'action' },
        { name: 'action_update', title: 'Update', align: 'center', width: '10%', type: 'action' }
      ],
      filters: [
        { type: FormInputEnum.INPUT, name: 'name', label: 'Website', text: 'Search', placeholder: 'Search for User' },
        { type: FormInputEnum.INPUT, name: 'email', label: 'Email', text: 'Email', placeholder: 'Search for Email' },
        {
          type: FormInputEnum.SELECT,
          name: 'emailVerified',
          label: 'Email Status',
          text: 'Verified',
          data: [
            { code: 'true', label: 'Verified' },
            { code: 'false', label: 'Pending' }
          ]
        }
      ],
      createInputs: [
        { type: FormInputEnum.INPUT, name: 'name', label: 'Name', disabled: false },
        { type: FormInputEnum.INPUT, name: 'email', label: 'Email', disabled: false }
      ],
      deleteInputs: [
        { type: FormInputEnum.INPUT, name: 'name', label: 'Name', disabled: true },
        { type: FormInputEnum.INPUT, name: 'email', label: 'Email', disabled: true },
        { type: FormInputEnum.SWITCH, name: 'emailVerified', label: 'emailVerified', disabled: true },
        { type: FormInputEnum.INPUT, name: 'createdAt', label: 'createdAt', disabled: true },
        { type: FormInputEnum.INPUT, name: 'updatedAt', label: 'updatedAt', disabled: true },
        { type: FormInputEnum.INPUT, name: 'deletedAt', label: 'deletedAt', disabled: true }
      ],
      editInputs: [
        { type: FormInputEnum.INPUT, name: 'name', label: 'Name', disabled: true },
        { type: FormInputEnum.INPUT, name: 'email', label: 'Email', disabled: true },
        { type: FormInputEnum.INPUT, name: 'locale', label: 'Locale', disabled: false },
        { type: FormInputEnum.INPUT, name: 'createdAt', label: 'createdAt', disabled: true },
        { type: FormInputEnum.INPUT, name: 'updatedAt', label: 'updatedAt', disabled: true }
      ],
      createActions: [
        { text: 'Add', type: FormButtonEnum.ADD },
        { text: 'Cancel', type: FormButtonEnum.CLOSE }
      ],

      deleteActions: [
        { text: 'Delete', type: FormButtonEnum.DELETE },
        { text: 'Cancel', type: FormButtonEnum.CLOSE }
      ],

      editActions: [
        { text: 'Update', type: FormButtonEnum.UPDATE },
        { text: 'Cancel', type: FormButtonEnum.CLOSE }
      ]
    }
  }

  async createUser(body: CreateUserDto) {
    const isUserExist = await this._prisma.users.findFirst({
      where: { email: body.email, name: body.name, deletedAt: null }
    })
    if (isUserExist) throw new BadRequestException('ERROR_USER_EXIST')
    const result = await this._prisma.users.create({
      data: {
        email: body.email,
        name: body.name,
        locale: body.locale,
        picture: body.picture,
        emailVerified: body.emailVerified,
        iss: body.iss,
        aud: body.aud,
        createdAt: new Date()
      }
    })
    return result
  }

  async updateUser(id: string, body: UpdateUserDto) {
    console.log('>>>Check: ', body.emailVerified)
    const isUserExist = await this._prisma.users.findFirst({ where: { id: id, deletedAt: null } })
    if (!isUserExist) throw new BadRequestException('ERROR_USER_NOT_FOUND')
    const result = await this._prisma.users.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })
    return { ...result }
  }

  async deleteUser(id: string) {
    const checkExist = await this._prisma.users.findFirst({ where: { id: id, deletedAt: null } })
    if (!checkExist) throw new BadRequestException('ERROR_USER_NOT_FOUND')
    await this._prisma.users.update({
      where: { id: id, deletedAt: null },
      data: { deletedAt: new Date() }
    })
    return true
  }
}
