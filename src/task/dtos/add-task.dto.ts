import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AddTaskDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    priority: number;
}
