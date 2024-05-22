import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task-dto';

@Controller()
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    createTask(@Body() { name, priority, userId }: CreateTaskDto) {
        return this.taskService.addTask(name, userId, priority);
    }

    @Get('/user/:userId')
    getUserTasks(@Param('userId') userId: string) {
        return this.taskService.getUserTasks(userId);
    }
}
