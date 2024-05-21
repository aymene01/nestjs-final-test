import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserWithTasks {
    email: string;
    name: string | null;
    tasks: { name: string }[];
}

const usersWithTasks: UserWithTasks[] = [
    {
        email: 'user1@example.com',
        name: 'User 1',
        tasks: [{ name: 'Task 1.1' }, { name: 'Task 1.2' }],
    },
    {
        email: 'user2@example.com',
        name: 'User 2',
        tasks: [
            { name: 'Task 2.1' },
            { name: 'Task 2.2' },
            { name: 'Task 2.3' },
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

const createTask = async (name: string, userId: string) => {
    const task = await prisma.task.create({
        data: {
            name,
            userId,
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
                await createTask(task.name, user.id);
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
