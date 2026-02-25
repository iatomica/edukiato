import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum EventType {
    CLASS = 'class',
    WORKSHOP = 'workshop',
    EVENT = 'event',
}

export enum SharedScope {
    ALL = 'ALL',
    COURSE = 'COURSE',
    INDIVIDUAL = 'INDIVIDUAL',
}

class SharedWithDto {
    @IsEnum(SharedScope)
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

    @IsEnum(EventType)
    @IsOptional()
    type?: EventType;

    @IsString()
    @IsOptional()
    color?: string;

    @ValidateNested()
    @Type(() => SharedWithDto)
    @IsOptional()
    sharedWith?: SharedWithDto;
}
