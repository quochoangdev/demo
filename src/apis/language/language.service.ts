import { BaseService } from '@/shared/base.service'
import { toId } from '@/shared/util'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { EditLanguageDto, FilterLanguageDto } from './language.dto'
import { FormButtonEnum, FormInputEnum } from '@/constants'

@Injectable()
export class LanguageService extends BaseService {
  async deleteKey(code: string, key: string) {
    const language = await this._prisma.languages.findUnique({ select: { content: true }, where: { code } })

    if (!language) {
      return { status: true }
    }

    const data: Prisma.LanguagesUpdateInput = {
      content: language.content.filter((c) => c['key'] !== key)
    }
    return this._prisma.languages.update({ where: { code }, data, select: { updatedAt: true } })
  }

  async findAllLanguage(query: FilterLanguageDto) {
    const { code = 'en' } = query

    const where = {
      code
    }

    const [language, count] = await Promise.all([
      this._prisma.languages.findUnique({
        where: where,
        select: { code: true, content: true }
      }),
      this._prisma.languages.count({ where })
    ])
    if (!language) {
      return {
        pagination: {
          page: 1,
          pageSize: count,
          total: count
        },
        title: 'All Language',
        data: [],
        header: [
          { name: 'key', title: 'Key', align: 'left', width: '20%', type: 'string' },
          { name: 'value', title: 'Value', align: 'left', width: '20%', type: 'string' }
        ]
      }
    }
    return {
      pagination: {
        page: 1,
        pageSize: count,
        total: count
      },
      title: 'All Language',
      data: language.content.map((l: any) => ({ ...l, id: l.key })),
      header: [
        { name: 'key', title: 'Key', align: 'left', width: '20%', type: 'string' },
        { name: 'value', title: 'Value', align: 'left', width: '300px', type: 'string' },
        { name: 'action_update', align: 'right', width: '10%', type: 'action' },
        { name: 'action_delete', align: 'right', width: '10%', type: 'action' }
      ],

      createInputs: [
        { type: FormInputEnum.INPUT, name: 'key', label: 'key', required: true },
        { type: FormInputEnum.INPUT, name: 'value', label: 'value', required: true }
      ] as InputProps[],
      createActions: [
        { text: 'Add', type: FormButtonEnum.ADD },
        { text: 'Cancel', type: FormButtonEnum.CLOSE }
      ],

      deleteInputs: [
        { type: FormInputEnum.INPUT, name: 'key', label: 'key', disabled: true },
        { type: FormInputEnum.INPUT, name: 'value', label: 'value', disabled: true }
      ] as InputProps[],
      deleteActions: [
        { text: 'Delete', type: FormButtonEnum.DELETE },
        { text: 'Cancel', type: FormButtonEnum.CLOSE }
      ]
    }
  }

  async upsertLanguage(code: string, input: EditLanguageDto) {
    const language = await this._prisma.languages.findUnique({ select: { content: true }, where: { code } })
    if (!language) {
      const data: Prisma.LanguagesCreateInput = { id: toId(16), code, ...input }
      return this._prisma.languages.create({ data, select: { updatedAt: true } })
    }

    const { key, value, ...data } = input
    const content = [{ key: key, value: value }]

    content.forEach((c) => {
      const idx = language.content.findIndex((l: { key: string }) => c.key === l.key)
      if (idx !== -1) {
        language.content[idx] = c
      } else {
        language.content.unshift(c)
      }
    })
    data['content'] = language.content
    return this._prisma.languages.update({ where: { code }, data, select: { content: true } })
  }

  async findLanguageByCode(code = 'en') {
    const language = await this._prisma.languages.findUnique({ select: { code: true, content: true }, where: { code } })

    if (!language) {
      return { code, content: [] }
    }

    return language
  }
}
