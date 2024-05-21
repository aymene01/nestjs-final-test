import { Controller, Post, Body, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { AddTaskDto } from './dtos/add-task.dto';
import { UserExists } from '../decorator/user-exist';

@Controller()
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    createTask(
        @UserExists('userId') userId: string,
        @Body() { name, priority }: AddTaskDto,
    ) {
        return this.taskService.addTask(name, userId, priority);
    }

    @Get('/user/:userId')
    getUserTasks(@UserExists('userId') userId: string) {
        return this.taskService.getUserTasks(userId);
    }
}
