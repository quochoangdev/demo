import { Public } from '@/shared/util'
import { Controller, Get, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common'

import { TrackingService } from './tracking.service'
import { FilterTrackingDto } from './tracking.dto'
@Public()
@Controller('tracking')
export class TrackingController {
  constructor(private readonly service: TrackingService) {}
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTracking(@Query() query: FilterTrackingDto, @Req() req: Request) {
    return this.service.getTracking(query, req['admin-user'])
  }
}
