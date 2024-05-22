import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../infrastructure/database/services/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async addUser(email: string): Promise<User> {
        const user = await this.getUser(email);
        if (user) throw new ConflictException('User already exist');

        return this.prisma.user.create({
            data: {
                email,
            },
        });
    }

    getUser(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    getUserById(userId: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    }

    resetData(): Promise<Prisma.BatchPayload> {
        return this.prisma.user.deleteMany();
    }
}
