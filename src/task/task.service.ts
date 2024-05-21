import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/services/prisma.service';
import { Prisma, Task } from '@prisma/client';
import { AddTaskDto } from './dtos/add-task.dto';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) {}

    async addTask(
        name: AddTaskDto['name'],
        userId: AddTaskDto['userId'],
        priority: AddTaskDto['priority'],
    ): Promise<Task> {
        return this.prisma.task.create({
            data: {
                name,
                priority: priority ? Number(priority) : 0,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }

    getTaskByName(name: string): Promise<Task | null> {
        return this.prisma.task.findFirst({
            where: {
                name,
            },
        });
    }

    async getUserTasks(userId: string): Promise<Task[]> {
        return this.prisma.task.findMany({
            where: {
                userId,
            },
        });
    }

    async resetData(): Promise<Prisma.BatchPayload> {
        return this.prisma.task.deleteMany();
    }
}
