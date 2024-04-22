import { Public } from '@/shared/util'
import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common'
import { EditLanguageDto, EditQueryLanguageDto, FilterLanguageDto } from './language.dto'
import { LanguageService } from './language.service'

@Public()
@Controller('languages')
export class LanguageController {
  constructor(private readonly service: LanguageService) {}

  @Get()
  async findAll(@Query() query: FilterLanguageDto) {
    return this.service.findAllLanguage(query)
  }

  @Post()
  async updateLanguage(@Query() query: EditQueryLanguageDto, @Body() body: EditLanguageDto, @Req() req: Request) {
    return this.service.upsertLanguage(query?.code || 'en', body)
  }

  @Delete('/:key')
  async deleteKey(@Query() query: EditQueryLanguageDto, @Param('key') key: string) {
    return this.service.deleteKey(query?.code || 'en', key)
  }
}
