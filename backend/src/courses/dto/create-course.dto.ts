import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsUUID, IsEnum, IsUrl, IsIn } from 'class-validator';

export enum CourseStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export const VALID_COURSE_TYPES = ['REGULAR', 'WORKSHOP', 'SEMINAR'] as const;
export type CourseTypeDto = typeof VALID_COURSE_TYPES[number];

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsIn(VALID_COURSE_TYPES)
  courseType: CourseTypeDto;

  @IsNotEmpty()
  @IsUUID()
  termId: string;

  @IsNotEmpty()
  @IsUUID()
  teacherId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsNotEmpty()
  @IsString()
  scheduleText: string; // e.g., "Mon/Wed 18:00"

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsIn(VALID_COURSE_TYPES)
  courseType?: CourseTypeDto;

  // ... maps to other fields as optional
}