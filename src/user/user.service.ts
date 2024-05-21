import {
    ConflictException,
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { AddUserDto, GetUserDto } from './dtos';
import { PrismaService } from '../infrastructure/database/services/prisma.service';

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async addUser(email: AddUserDto['email']): Promise<User> {
        const isEmailValid = EMAIL_REGEX.test(email);

        if (!isEmailValid) {
            throw new BadRequestException('Invalid email');
        }

        const user = await this.getUser(email);

        if (user) throw new ConflictException('User already exist');

        return this.prisma.user.create({
            data: {
                email,
            },
        });
    }

    getUser(email: GetUserDto['email']): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async resetData(): Promise<Prisma.BatchPayload> {
        return this.prisma.user.deleteMany();
    }
}
