import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum EventType {
    CLASS = 'class',
    WORKSHOP = 'workshop',
    EVENT = 'event',
}

export enum SharedScope {
    ALL = 'ALL',
    COURSE = 'COURSE',
    AULA = 'AULA',
    INDIVIDUAL = 'INDIVIDUAL',
}

class SharedWithDto {
    @IsString()
    scope: SharedScope;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    targetIds?: string[];
}

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    start: Date;

    @IsDateString()
    end: Date;

    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    color?: string;

    @ValidateNested()
    @Type(() => SharedWithDto)
    @IsOptional()
    sharedWith?: SharedWithDto;
}
