/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
  } from '@nestjs/common';

  import { UserDto } from 'src/dtos/updateuser.dtos'
  import { User } from 'src/entities/user.entity';
  import { UserService } from 'src/services/user.service';

@Controller('users')    
export class UsersController {
    constructor(
        private userService: UserService,
    ){}

    @Get()
    async getAllUsers(@Query('page') page = 1, @Query('limit') limit = 10):Promise<User[]> {
        return this.userService.getAllUsers(page,limit)
    }

    @Get(":id")
    async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        return this.userService.getUserById(id)
    }

    @Put(":id")
    async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<UserDto>): Promise<User> {
        return this.userService.updateUser(id,data)
    }

    @Delete(":id")
    async deleteUser(@Param("id", ParseUUIDPipe) id: string): Promise<string> {
        return this.userService.deleteUser(id)
    }


}
