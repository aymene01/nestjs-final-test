import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [DatabaseModule, UserModule],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule {}
