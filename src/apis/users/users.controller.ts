import { Public } from '@/shared/util'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common'

import { CreateUserDto, FilterUserDto, UpdateUserDto } from './users.dto'
import { UsersService } from './users.service'
@Public()
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getUser(@Query() query: FilterUserDto, @Req() req: Request) {
    return this.service.findUsers(query, req['admin-user'])
  }

  @Post()
  async createUsers(@Body() body: CreateUserDto) {
    return this.service.createUser(body)
  }
  @Patch('/:id')
  async updateUsers(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.service.updateUser(id, body)
  }
  @Delete('/:id')
  async deleteUsers(@Param('id') id: string) {
    return this.service.deleteUser(id)
  }
}
