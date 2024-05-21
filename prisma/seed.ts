import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserWithTasks {
    email: string;
    name: string | null;
    tasks: { name: string; priority: number }[];
}

const usersWithTasks: UserWithTasks[] = [
    {
        email: 'user1@example.com',
        name: 'User 1',
        tasks: [
            { name: 'Task 1.1', priority: 10 },
            { name: 'Task 1.2', priority: 12 },
        ],
    },
    {
        email: 'user2@example.com',
        name: 'User 2',
        tasks: [
            { name: 'Task 2.1', priority: 1 },
            { name: 'Task 2.2', priority: 23 },
            { name: 'Task 2.3', priority: 10 },
        ],
    },
];

const createUser = async (email: string, name: string | null) => {
    const user = await prisma.user.create({
        data: {
            email,
            name,
        },
    });
    console.log(`Created user with email ${user.email}`);
    return user;
};

const createTask = async (name: string, userId: string, priority: number) => {
    const task = await prisma.task.create({
        data: {
            name,
            userId,
            priority,
        },
    });
    console.log(
        `Created task with name ${task.name} for user with ID ${task.userId}`,
    );
};

const seed = async () => {
    const userPromises = usersWithTasks.map(async ({ email, name, tasks }) => {
        const user = await createUser(email, name);
        await Promise.all(
            tasks.map(async (task) => {
                await createTask(task.name, user.id, task.priority);
            }),
        );
        return user;
    });
    const users = await Promise.all(userPromises);
    await prisma.$disconnect();
    console.log('Seed complete');
    return users;
};

seed().then((users) => console.log(users));
