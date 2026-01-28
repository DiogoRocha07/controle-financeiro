// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Body, Controller, Post, Get, Query, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async findByEmail(@Query('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Delete('me')
  async deleteMetadata(@Query('email') email: string) {
    return this.usersService.deleteUser(email);
  }
}
