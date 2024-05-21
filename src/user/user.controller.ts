import { Controller, Delete, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto } from './dtos';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async addUser(@Body() { email }: AddUserDto) {
        return await this.userService.addUser(email);
    }

    @Get(':email')
    async getUser(@Param('email') email: string) {
        return await this.userService.getUser(email);
    }

    @Delete()
    async deleteAllUsers() {
        return await this.userService.resetData();
    }
}
