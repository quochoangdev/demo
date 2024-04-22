import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common'

import { CreateSiteDto, FilterSitesDto, UpdateSiteDto } from './sites.dto'
import { SitesService } from './sites.service'
//
@Controller('sites')
export class SitesController {
  constructor(private readonly service: SitesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSites(@Query() query: FilterSitesDto, @Req() req: Request) {
    return this.service.findSites(query, req['admin-user'])
  }

  @Post()
  async createSites(@Body() body: CreateSiteDto, @Req() req: Request) {
    return this.service.createSites(body, req['admin-user'])
  }

  @Patch(':id')
  async updateSites(@Param('id') id: string, @Body() body: UpdateSiteDto, @Req() req: Request) {
    return this.service.updateSites(id, body, req['admin-user'])
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req: Request) {
    return this.service.deleteSites(id, req['admin-user'])
  }
}
