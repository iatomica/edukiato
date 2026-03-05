import { IsString, IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SharedScope } from './create-event.dto';

class SharedWithDto {
    @IsString()
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

