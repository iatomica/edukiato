import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max, IsBoolean, IsDateString } from 'class-validator';

export class CreateAssignmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  isGroupProject?: boolean;
}

export class GradeSubmissionDto {
  @IsNotEmpty()
  @IsString()
  feedbackText: string; // Mandatory: Human feedback is priority.

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number; // Optional: Not all art projects need a number.

  @IsOptional()
  @IsString()
  status?: 'GRADED' | 'LATE' | 'SUBMITTED';
}