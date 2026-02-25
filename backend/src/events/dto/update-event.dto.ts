import { IsString, IsDateString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventType, SharedScope } from './create-event.dto';

class SharedWithDto {
    @IsEnum(SharedScope)
    @IsOptional()
    scope?: SharedScope;

    @IsString({ each: true })
    @IsOptional()
    targetIds?: string[];
}

export class UpdateEventDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    start?: Date;

    @IsDateString()
    @IsOptional()
    end?: Date;

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

