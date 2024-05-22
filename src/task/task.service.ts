import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../infrastructure/database/services/prisma.service';
import { Prisma, Task } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
    ) {}

    async addTask(
        name: string,
        userId: string,
        priority: number,
    ): Promise<Task> {
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new BadRequestException(`User with ${userId} does not exist`);
        }

        return this.prisma.task.create({
            data: {
                name,
                priority: Number(priority),
                userId: userId,
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
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new BadRequestException(`User with ${userId} does not exist`);
        }

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
