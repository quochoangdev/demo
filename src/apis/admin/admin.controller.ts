import { Controller, Get, Req, UsePipes, ValidationPipe } from '@nestjs/common'

import { AdminService } from './admin.service'
import { Public } from '@/shared/util'
//
@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('menu')
  async getMenu(@Req() req: Request) {
    return this.service.getMenu()
  }
}
