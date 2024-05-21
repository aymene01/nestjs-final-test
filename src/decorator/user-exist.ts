import {
    BadRequestException,
    ExecutionContext,
    createParamDecorator,
} from '@nestjs/common';

import { isValidEmail } from '../utils/validation';
import { PrismaService } from '../infrastructure/database/services/prisma.service';
import { Prisma } from '@prisma/client';

type UserExistsParam = 'email' | 'userId';

interface RequestDataTypes {
    email?: string;
    userId?: string;
}

const extractRequestData = (ctx: ExecutionContext): RequestDataTypes => {
    const request = ctx.switchToHttp().getRequest();
    return {
        email: request.params.email || request.body.email,
        userId: request.params.userId || request.body.userId,
    };
};

const validateRequestData = (requestData: RequestDataTypes) => {
    if (!requestData.email && !requestData.userId) {
        throw new BadRequestException('Email or userId is required');
    }

    if (requestData.email && !isValidEmail(requestData.email)) {
        throw new BadRequestException('Invalid email');
    }
};

const findUserOrThrow = async (
    prismaService: PrismaService,
    searchParam: Prisma.UserWhereUniqueInput,
    param: UserExistsParam,
) => {
    await prismaService.user
        .findUniqueOrThrow({ where: searchParam })
        .catch(() => {
            throw new BadRequestException(`User with ${param} does not exist`);
        })
        .finally(() => prismaService.$disconnect());
};

export const UserExists = createParamDecorator(
    async (param: UserExistsParam, ctx: ExecutionContext) => {
        const prismaService = new PrismaService();
        const requestData = extractRequestData(ctx);

        validateRequestData(requestData);

        const searchParam: Prisma.UserWhereUniqueInput = requestData.email
            ? { email: requestData.email }
            : { id: requestData.userId };

        await findUserOrThrow(prismaService, searchParam, param);

        return requestData.email || requestData.userId;
    },
);
